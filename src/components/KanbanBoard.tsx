import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Deal, DealStage, ColumnStats } from '@/types';
import { useState, useEffect } from 'react';
import DealCard from './DealCard';

const STAGES: DealStage[] = ["Demo'd", 'Closing', 'Won', 'Lost'];
const FORECAST_PERCENTAGES = {
  "Demo'd": 0.2,
  'Closing': 0.5,
  'Won': 1,
  'Lost': 0.02
};

export default function KanbanBoard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [columns, setColumns] = useState<Record<DealStage, Deal[]>>({
    "Demo'd": [],
    'Closing': [],
    'Won': [],
    'Lost': []
  });

  useEffect(() => {
    const savedDeals = localStorage.getItem('deals');
    if (savedDeals) {
      const parsedDeals = JSON.parse(savedDeals);
      setDeals(parsedDeals);
      updateColumns(parsedDeals);
    }
  }, []);

  const updateColumns = (deals: Deal[]) => {
    const newColumns = deals.reduce((acc, deal) => {
      acc[deal.stage].push(deal);
      return acc;
    }, { "Demo'd": [], 'Closing': [], 'Won': [], 'Lost': [] } as Record<DealStage, Deal[]>);
    setColumns(newColumns);
  };

  const calculateColumnStats = (stage: DealStage): ColumnStats => {
    const columnDeals = columns[stage];
    const deals = columnDeals.length;
    const amount = columnDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const forecast = amount * FORECAST_PERCENTAGES[stage];
    return { deals, amount, forecast };
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const deal = deals.find(d => d.id === draggableId);
    if (!deal) return;

    const newDeals = deals.map(d => {
      if (d.id === draggableId) {
        return { ...d, stage: destination.droppableId as DealStage };
      }
      return d;
    });

    setDeals(newDeals);
    updateColumns(newDeals);
    localStorage.setItem('deals', JSON.stringify(newDeals));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 p-6 overflow-x-auto">
        {STAGES.map(stage => {
          const stats = calculateColumnStats(stage);
          return (
            <div key={stage} className="kanban-column">
              <div className="column-header">{stage}</div>
              <div className="column-stats">
                <div>Deals: {stats.deals}</div>
                <div>Amount: ${stats.amount.toLocaleString()}</div>
                <div className={stage === 'Won' ? 'amount-won' : ''}>
                  {stage === 'Won' ? 'Total Won' : `Forecast (${(FORECAST_PERCENTAGES[stage] * 100).toFixed(0)}%)`}: 
                  ${stats.forecast.toLocaleString()}
                </div>
              </div>
              <Droppable droppableId={stage}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {columns[stage].map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <DealCard deal={deal} />
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
