'use client';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Deal, DealStage } from '@/types';
import { useDeals } from '@/contexts/DealsContext';
import DealCard from './DealCard';
import StageStatsModal from './StageStatsModal';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const STAGES: DealStage[] = ["Demo'd", "Closing", "Won", "Lost"];

const STAGE_DISPLAY_NAMES: Record<DealStage, string> = {
  "Demo'd": "Demo'd",
  "Closing": "Closing",
  "Won": "Won",
  "Lost": "Lost"
};

const FORECAST_PERCENTAGES = {
  "Demo'd": 0.15,
  'Closing': 0.5,
  'Won': 1,
  'Lost': 0.03
};

export default function KanbanBoard() {
  const { deals, updateDeal } = useDeals();
  const [localDeals, setLocalDeals] = useState<Deal[]>(deals);
  const [selectedStage, setSelectedStage] = useState<DealStage | null>(null);
  const [collapsedColumns, setCollapsedColumns] = useState<Set<DealStage>>(new Set());

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

    let combinedForecast;

    if (stage === 'Won') {
      // For Won column, sum up forecasted values from other columns
      const otherStages = ["Demo'd", "Closing", "Lost"];
      combinedForecast = Math.round(otherStages.reduce((sum, otherStage) => {
        const stageDeals = getColumnDeals(otherStage as DealStage);
        const stageTotal = stageDeals.reduce((s, deal) => s + deal.amount + deal.raas, 0);
        return sum + (stageTotal * FORECAST_PERCENTAGES[otherStage as DealStage]);
      }, 0));
    } else {
      // For other columns, calculate based on their own percentage
      const total = arr + raas;
      combinedForecast = Math.round(total * FORECAST_PERCENTAGES[stage]);
    }

    return { dealsCount, arr, raas, combinedForecast };
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

  const toggleColumnCollapse = (stage: DealStage) => {
    setCollapsedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stage)) {
        newSet.delete(stage);
      } else {
        newSet.add(stage);
      }
      return newSet;
    });
  };

  const isColumnCollapsible = (stage: DealStage) => {
    return stage === 'Won' || stage === 'Lost';
  };

  const isWideColumn = (stage: DealStage) => {
    return stage === "Demo'd" || stage === "Closing";
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center min-h-screen bg-gray-50">
        <div className="flex gap-8 px-6">
          {STAGES.map(stage => {
            const stats = calculateColumnStats(stage);
            const isCollapsible = isColumnCollapsible(stage);
            const isCollapsed = collapsedColumns.has(stage);
            const isWide = isWideColumn(stage);
            
            return (
              <div 
                key={stage} 
                className={`flex-none transition-all duration-300 ${
                  isCollapsed ? 'w-[40px]' : isWide ? 'w-[600px]' : 'w-[280px]'
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  {isCollapsible && (
                    <button
                      onClick={() => toggleColumnCollapse(stage)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {isCollapsed ? (
                        <ChevronRightIcon className="h-5 w-5" />
                      ) : (
                        <ChevronLeftIcon className="h-5 w-5" />
                      )}
                    </button>
                  )}
                  <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 overflow-hidden w-0' : 'opacity-100'}`}>
                    <button
                      onClick={() => setSelectedStage(stage)}
                      className="text-xl font-bold text-gray-900 hover:text-app-purple transition-colors whitespace-nowrap"
                    >
                      {STAGE_DISPLAY_NAMES[stage]}: {stats.dealsCount}
                    </button>
                  </div>
                </div>

                <div className={`space-y-1 mb-4 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 overflow-hidden w-0' : 'opacity-100'}`}>
                  <div className="text-sm">
                    <span className="font-normal">ARR: </span>
                    <span className={`${stage === 'Won' ? 'font-bold text-green-600' : 
                      stage === 'Lost' ? 'text-gray-500' :
                      stage === 'Closing' ? 'text-app-purple' :
                      'text-blue-600'
                    }`}>
                      ${stats.arr.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-normal">Estimated RaaS: </span>
                    <span className={`${stage === 'Won' ? 'font-bold text-green-600' : 
                      stage === 'Lost' ? 'text-gray-500' :
                      stage === 'Closing' ? 'text-app-purple' :
                      'text-blue-600'
                    }`}>
                      ${stats.raas.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-normal">
                      {stage === 'Won' ? 'Total Forecast: ' : `Forecast (${FORECAST_PERCENTAGES[stage] * 100}%): `}
                    </span>
                    <span className="text-gray-900">
                      ${stats.combinedForecast.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={stage}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`transition-all duration-300 ${
                        isCollapsed ? 'opacity-0 overflow-hidden w-0' : ''
                      } ${isWide ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}
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
      </div>

      {selectedStage && (
        <StageStatsModal
          isOpen={true}
          onClose={() => setSelectedStage(null)}
          stage={selectedStage}
          stats={calculateColumnStats(selectedStage)}
          forecastPercentage={FORECAST_PERCENTAGES[selectedStage]}
        />
      )}
    </DragDropContext>
  );
}
