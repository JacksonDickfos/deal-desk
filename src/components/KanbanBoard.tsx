'use client';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Deal, DealStage } from '@/types';
import { useDeals } from '@/contexts/DealsContext';
import DealCard from './DealCard';
import { useState, useEffect } from 'react';

const STAGES: DealStage[] = ["Demo'd", "Closing", "Won", "Lost"];

const STAGE_DISPLAY_NAMES: Record<DealStage, string> = {
  "Demo'd": "Demo'd",
  "Closing": "Closing",
  "Won": "Won",
  "Lost": "Lost"
};

const FORECAST_PERCENTAGES = {
  "Demo'd": 0.2,
  'Closing': 0.5,
  'Won': 1,
  'Lost': 0.02
};

export default function KanbanBoard() {
  const { deals, updateDeal } = useDeals();
  const [localDeals, setLocalDeals] = useState<Deal[]>(deals);

  useEffect(() => {
    setLocalDeals(deals);
  }, [deals]);

  const getColumnDeals = (stage: DealStage): Deal[] => {
    return localDeals.filter((deal: Deal) => deal.stage === stage);
  };

  const calculateColumnStats = (stage: DealStage) => {
    const columnDeals = getColumnDeals(stage);
    const dealsCount = columnDeals.length;
    const arr = columnDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const raas = columnDeals.reduce((sum, deal) => sum + deal.raas, 0);

    let forecastedArr;
    let forecastedRaas;

    if (stage === 'Won') {
      // For Won column, sum up forecasted values from other columns
      const otherStages = ["Demo'd", "Closing", "Lost"];
      forecastedArr = otherStages.reduce((sum, otherStage) => {
        const stageDeals = getColumnDeals(otherStage as DealStage);
        const stageArr = stageDeals.reduce((s, deal) => s + deal.amount, 0);
        return sum + (stageArr * FORECAST_PERCENTAGES[otherStage as DealStage]);
      }, 0);

      forecastedRaas = otherStages.reduce((sum, otherStage) => {
        const stageDeals = getColumnDeals(otherStage as DealStage);
        const stageRaas = stageDeals.reduce((s, deal) => s + deal.raas, 0);
        return sum + (stageRaas * FORECAST_PERCENTAGES[otherStage as DealStage]);
      }, 0);
    } else {
      // For other columns, calculate based on their own percentage
      forecastedArr = arr * FORECAST_PERCENTAGES[stage];
      forecastedRaas = raas * FORECAST_PERCENTAGES[stage];
    }

    return { dealsCount, arr, raas, forecastedArr, forecastedRaas };
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const deal = localDeals.find((d: Deal) => d.id === draggableId);
    if (!deal) return;

    const updatedDeal = {
      ...deal,
      stage: destination.droppableId as DealStage,
      updated_at: new Date()
    };

    // Optimistically update the local state
    setLocalDeals(prevDeals => 
      prevDeals.map(d => d.id === draggableId ? updatedDeal : d)
    );

    // Update in the database
    try {
      await updateDeal(updatedDeal);
    } catch (error) {
      // If the update fails, revert the optimistic update
      setLocalDeals(deals);
      console.error('Failed to update deal:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-8 px-6 min-h-screen bg-gray-50">
        {STAGES.map(stage => {
          const stats = calculateColumnStats(stage);
          const isWonColumn = stage === 'Won';
          
          return (
            <div key={stage} className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {STAGE_DISPLAY_NAMES[stage]}
              </h2>
              
              <div className="space-y-1 mb-4">
                <div className="text-sm">
                  <span className="font-normal">Deals: </span>
                  <span className="font-medium">{stats.dealsCount}</span>
                </div>
                <div className="text-sm">
                  <span className="font-normal">ARR: </span>
                  <span className={`font-medium ${isWonColumn ? 'text-green-500' : ''}`}>
                    ${stats.arr.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-normal">RaaS: </span>
                  <span className={`font-medium ${isWonColumn ? 'text-green-500' : ''}`}>
                    ${stats.raas.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-normal">
                    {isWonColumn 
                      ? 'Total Forecasted ARR: ' 
                      : `Forecasted ARR (${(FORECAST_PERCENTAGES[stage] * 100)}%): `}
                  </span>
                  <span className={`font-medium ${isWonColumn ? 'text-purple-600' : ''}`}>
                    ${stats.forecastedArr.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-normal">
                    {isWonColumn 
                      ? 'Total Forecasted RaaS: ' 
                      : `Forecasted RaaS (${(FORECAST_PERCENTAGES[stage] * 100)}%): `}
                  </span>
                  <span className={`font-medium ${isWonColumn ? 'text-purple-600' : ''}`}>
                    ${stats.forecastedRaas.toLocaleString()}
                  </span>
                </div>
              </div>

              <Droppable droppableId={stage}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {getColumnDeals(stage).map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <DealCard 
                              deal={deal}
                              onDealUpdate={updateDeal}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
