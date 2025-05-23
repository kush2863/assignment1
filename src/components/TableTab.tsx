import { CheckCircle, Clock, Package, Hammer } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ItemImage from '/public/ItemImage.svg';
import Vector from '/public/Vector.svg';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: 'component' | 'weapon' | 'tool';
  icon: string;
  source: 'inventory' | 'crafting' | null;
}

interface DragState {
  isDragging: boolean;
  draggedItem: InventoryItem | null;
  draggedQuantity: number;
  source: 'inventory' | 'crafting' | null;
}

const TableTab = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Barrel Assault Rifle', quantity: 2, type: 'component', icon: ItemImage, source: 'inventory' },
    { id: '2', name: 'Fire Rate Assault Rifle', quantity: 3, type: 'component', icon: ItemImage, source: 'inventory' },
    { id: '3', name: 'Barrel 9', quantity: 2, type: 'component', icon: ItemImage, source: 'inventory' },
    { id: '4', name: 'Pistol Suppressor', quantity: 5, type: 'component', icon: ItemImage, source: 'inventory' },
    { id: '5', name: 'Rifle Suppressor', quantity: 3, type: 'component', icon: ItemImage, source: 'inventory' },
    { id: '6', name: 'Combat Knife', quantity: 4, type: 'weapon', icon: ItemImage, source: 'inventory' },
    { id: '7', name: 'Scope Mount', quantity: 2, type: 'component', icon: ItemImage, source: 'inventory' },
    { id: '8', name: 'Ammo Clip', quantity: 1, type: 'component', icon: ItemImage, source: 'inventory' },
    { id: '9', name: 'Tactical Grip', quantity: 3, type: 'component', icon: ItemImage, source: 'inventory' }
  ]);

  const [craftingTable, setCraftingTable] = useState<InventoryItem[]>([
    { id: 'craft1', name: 'Barrel Assault Rifle', quantity: 1, type: 'component', icon: ItemImage, source: 'crafting' },
    { id: 'craft2', name: 'Fire Rate Assault Rifle', quantity: 2, type: 'component', icon: ItemImage, source: 'crafting' }
  ]);

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    draggedQuantity: 0,
    source: null
  });

  const [draggedQuantity, setDraggedQuantity] = useState(1);

  const [quantityModal, setQuantityModal] = useState<{ open: boolean; item: InventoryItem | null; index: number; source: 'inventory' | 'crafting' | null }>({ open: false, item: null, index: -1, source: null });
  const [pendingDrag, setPendingDrag] = useState<{ item: InventoryItem; index: number; source: 'inventory' | 'crafting' } | null>(null);

  const [pendingMove, setPendingMove] = useState<{
    item: InventoryItem;
    source: 'inventory' | 'crafting';
    destination: 'inventory' | 'crafting';
    sourceIndex: number;
    destinationIndex: number;
  } | null>(null);

  const [quantityToMove, setQuantityToMove] = useState(1);

  const handleCardMouseDown = (item: InventoryItem, index: number, source: 'inventory' | 'crafting') => {
    if (item.quantity > 1 && source === 'inventory') {
      setQuantityModal({ open: true, item, index, source });
    } else {
      setPendingDrag({ item, index, source });
    }
  };

  const handleQuantityConfirm = (quantity: number) => {
    if (quantityModal.item) {
      setDraggedQuantity(quantity);
      setPendingDrag({ item: quantityModal.item, index: quantityModal.index, source: quantityModal.source! });
      setQuantityModal({ open: false, item: null, index: -1, source: null });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceList = source.droppableId === 'inventory' ? inventory : craftingTable;
    const destinationList = destination.droppableId === 'inventory' ? inventory : craftingTable;
    const setSourceList = source.droppableId === 'inventory' ? setInventory : setCraftingTable;
    const setDestinationList = destination.droppableId === 'inventory' ? setInventory : setCraftingTable;

    const [movedItem] = sourceList.filter(item => item.id === draggableId);
    if (!movedItem) return;

    // If quantity > 1, show modal and wait for confirmation
    if (movedItem.quantity > 1) {
      setPendingMove({
        item: movedItem,
        source: source.droppableId as 'inventory' | 'crafting',
        destination: destination.droppableId as 'inventory' | 'crafting',
        sourceIndex: source.index,
        destinationIndex: destination.index
      });
      setQuantityToMove(1);
      return;
    }

    // Otherwise, move 1 item
    performMove(movedItem, 1, source, destination, setSourceList, setDestinationList, sourceList, destinationList);
  };

  function performMove(
    movedItem: InventoryItem,
    quantity: number,
    source: { droppableId: string; index: number },
    destination: { droppableId: string; index: number },
    setSourceList: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
    setDestinationList: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
    sourceList: InventoryItem[],
    destinationList: InventoryItem[]
  ) {
    if (quantity > movedItem.quantity) return;
    const itemToMoveWithQuantity: InventoryItem = {
      ...movedItem,
      quantity,
      source: destination.droppableId as 'inventory' | 'crafting',
      id: `${destination.droppableId}_${Date.now()}_${movedItem.id}`
    };
    const newSourceList = sourceList.map(item =>
      item.id === movedItem.id
        ? { ...item, quantity: item.quantity - quantity }
        : item
    ).filter(item => item.quantity > 0);
    const newDestinationList = Array.from(destinationList);
    const existingItemIndexInDestination = newDestinationList.findIndex(item => item.name === movedItem.name);
    if (existingItemIndexInDestination > -1) {
      const existingItem = newDestinationList[existingItemIndexInDestination];
      newDestinationList[existingItemIndexInDestination] = {
        ...existingItem,
        quantity: existingItem.quantity + quantity
      };
      newDestinationList.splice(destination.index, 0, newDestinationList.splice(existingItemIndexInDestination, 1)[0]);
    } else {
      newDestinationList.splice(destination.index, 0, itemToMoveWithQuantity);
    }
    setSourceList(newSourceList);
    setDestinationList(newDestinationList);
  }

  const ItemCard = ({ item, index, source }: { item: InventoryItem; index: number; source: 'inventory' | 'crafting' }) => (
    <Draggable draggableId={item.id} index={index} isDragDisabled={item.quantity === 0}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative flex justify-center items-center p-0 w-[85px] h-[85px] rounded-[20px] bg-[linear-gradient(168.45deg,rgba(255,255,255,0.4)_-64.17%,rgba(255,255,255,0)_89.83%)] border-none ${snapshot.isDragging ? 'ring-4 ring-purple-400' : ''}`}
          tabIndex={0}
          role="button"
          aria-label={`Drag ${item.name}`}
        >
          <div className="flex flex-col justify-center items-center p-0 w-[60px] h-[100px]">
            <img src={ItemImage} alt={item.name} className="w-[75px] h-[75px] object-contain m-0" />
            <div className="flex flex-row justify-center items-center p-0 w-[80px] h-[10px] mt-[-4px] mb-0" style={{margin: '-4px 0px'}}>
              <span className="w-[71px] h-[10px] font-inter font-normal text-[8px] leading-[10px] text-white opacity-60 text-center truncate" title={item.name}>{item.name}</span>
            </div>
            <div className="flex flex-row items-center p-[2px] gap-[2px] w-[21px] h-[14px] mt-1">
              <img src={Vector} alt="icon" className="w-[10px] h-[10px]" />
              <span className="w-[5px] h-[10px] font-inter font-semibold text-[8px] leading-[10px] text-white flex items-center">{item.quantity}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-semibold text-blue-300">Inventory</h3>
              <span className="text-sm text-gray-400">({inventory.length} items)</span>
            </div>
            <Droppable droppableId="inventory">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-xl py-6 min-h-[450px] transition-all duration-300 border-2 border-dashed ${
                    snapshot.isDraggingOver
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                      : 'border-slate-600/30'
                  }`}
                >
                  <div className="grid grid-cols-3 gap-2 pl-2">
                    {inventory.map((item, index) => (
                      <ItemCard key={item.id} item={item} index={index} source="inventory" />
                    ))}
                  </div>
                  {provided.placeholder}
                  {inventory.length === 0 && !snapshot.isDraggingOver && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Package className="w-16 h-16 mx-auto mb-2 opacity-30" />
                        <p>Inventory is empty</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hammer className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-semibold text-purple-300">Crafting Table</h3>
              <span className="text-sm text-gray-400">({craftingTable.length} items)</span>
            </div>
            <Droppable droppableId="crafting">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 min-h-[450px] transition-all duration-300 border-2 border-dashed ${
                    snapshot.isDraggingOver
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                      : 'border-slate-600/30'
                  }`}
                >
                  <div className="grid grid-cols-3 gap-2 pl-2">
                    {craftingTable.map((item, index) => (
                      <ItemCard key={item.id} item={item} index={index} source="crafting" />
                    ))}
                  </div>
                  {provided.placeholder}
                  
                  {craftingTable.length === 0 && !snapshot.isDraggingOver && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Hammer className="w-16 h-16 mx-auto mb-2 opacity-30" />
                        <p>Drop items here to craft</p>
                      </div>
                    </div>
                  )}
                  
                  {craftingTable.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-600/50">
                      <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30">
                        Start Crafting ({craftingTable.reduce((sum, item) => sum + item.quantity, 0)} items)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
      {pendingMove && (
        <Dialog open={!!pendingMove} onOpenChange={open => { if (!open) setPendingMove(null); }}>
          <DialogContent className="max-w-xs mx-auto">
            <div className="flex flex-col items-center gap-4">
              <img src={ItemImage} alt={pendingMove.item.name} className="w-16 h-16 object-contain" />
              <div className="text-lg font-semibold text-gray-200">Select Quantity</div>
              <input
                type="range"
                min={1}
                max={pendingMove.item.quantity}
                value={quantityToMove}
                onChange={e => setQuantityToMove(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="text-purple-400 font-bold text-xl">{quantityToMove}</div>
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                onClick={() => {
                  // Actually perform the move
                  const sourceList = pendingMove.source === 'inventory' ? inventory : craftingTable;
                  const destinationList = pendingMove.destination === 'inventory' ? inventory : craftingTable;
                  const setSourceList = pendingMove.source === 'inventory' ? setInventory : setCraftingTable;
                  const setDestinationList = pendingMove.destination === 'inventory' ? setInventory : setCraftingTable;
                  performMove(pendingMove.item, quantityToMove, { droppableId: pendingMove.source, index: pendingMove.sourceIndex }, { droppableId: pendingMove.destination, index: pendingMove.destinationIndex }, setSourceList, setDestinationList, sourceList, destinationList);
                  setPendingMove(null);
                }}
              >
                Confirm
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DragDropContext>
  );
};

export default TableTab;