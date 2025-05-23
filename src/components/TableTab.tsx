
import React, { useState } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: 'component' | 'weapon' | 'tool';
  icon: string;
}

interface DragState {
  isDragging: boolean;
  draggedItem: InventoryItem | null;
  draggedQuantity: number;
}

export const TableTab = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Barrel Assault Rifle', quantity: 2, type: 'component', icon: '🔧' },
    { id: '2', name: 'Fire Rate Assault Rifle', quantity: 3, type: 'component', icon: '⚙️' },
    { id: '3', name: 'Barrel 9', quantity: 2, type: 'component', icon: '🔩' },
    { id: '4', name: 'Pistol Suppressor', quantity: 5, type: 'component', icon: '🔫' },
    { id: '5', name: 'Rifle Suppressor', quantity: 3, type: 'component', icon: '🎯' },
    { id: '6', name: 'Pistol Suppressor', quantity: 4, type: 'component', icon: '🔫' },
    { id: '7', name: 'Pistol Suppressor', quantity: 2, type: 'component', icon: '🔫' },
    { id: '8', name: 'Rifle Suppressor', quantity: 1, type: 'component', icon: '🎯' },
    { id: '9', name: 'Pistol Suppressor', quantity: 3, type: 'component', icon: '🔫' }
  ]);

  const [craftingTable, setCraftingTable] = useState<InventoryItem[]>([
    { id: 'craft1', name: 'Barrel Assault Rifle', quantity: 2, type: 'component', icon: '🔧' },
    { id: 'craft2', name: 'Fire Rate Assault Rifle', quantity: 2, type: 'component', icon: '⚙️' },
    { id: 'craft3', name: 'Barrel 9', quantity: 2, type: 'component', icon: '🔩' }
  ]);

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    draggedQuantity: 0
  });

  const [history] = useState([
    { id: 'h1', name: 'Repair Kit', date: '2024-06-17 16:07', icon: '🧰' },
    { id: 'h2', name: 'Bolt Assembly', date: '2024-02-17 11:26', icon: '🔩' },
    { id: 'h3', name: 'Hammer P', date: '2024-01-01 08:15', icon: '🔨' }
  ]);

  const handleDragStart = (item: InventoryItem, source: 'inventory' | 'crafting') => {
    setDragState({
      isDragging: true,
      draggedItem: { ...item, source } as any,
      draggedQuantity: Math.min(item.quantity, 1)
    });
  };

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      draggedQuantity: 0
    });
  };

  const handleDrop = (target: 'inventory' | 'crafting') => {
    if (!dragState.draggedItem) return;

    const sourceIsInventory = (dragState.draggedItem as any).source === 'inventory';
    const targetIsInventory = target === 'inventory';

    if (sourceIsInventory === targetIsInventory) {
      handleDragEnd();
      return;
    }

    const moveQuantity = dragState.draggedQuantity;
    const itemId = dragState.draggedItem.id;

    if (sourceIsInventory) {
      // Moving from inventory to crafting table
      setInventory(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity - moveQuantity }
          : item
      ).filter(item => item.quantity > 0));

      setCraftingTable(prev => {
        const existingItem = prev.find(item => item.name === dragState.draggedItem!.name);
        if (existingItem) {
          return prev.map(item => 
            item.name === dragState.draggedItem!.name
              ? { ...item, quantity: item.quantity + moveQuantity }
              : item
          );
        } else {
          return [...prev, { 
            ...dragState.draggedItem!, 
            id: `craft_${Date.now()}`,
            quantity: moveQuantity 
          }];
        }
      });
    } else {
      // Moving from crafting table to inventory
      setCraftingTable(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity - moveQuantity }
          : item
      ).filter(item => item.quantity > 0));

      setInventory(prev => {
        const existingItem = prev.find(item => item.name === dragState.draggedItem!.name);
        if (existingItem) {
          return prev.map(item => 
            item.name === dragState.draggedItem!.name
              ? { ...item, quantity: item.quantity + moveQuantity }
              : item
          );
        } else {
          return [...prev, { 
            ...dragState.draggedItem!, 
            id: `inv_${Date.now()}`,
            quantity: moveQuantity 
          }];
        }
      });
    }

    handleDragEnd();
  };

  const ItemCard = ({ item, source }: { item: InventoryItem; source: 'inventory' | 'crafting' }) => (
    <div
      draggable
      onDragStart={() => handleDragStart(item, source)}
      onDragEnd={handleDragEnd}
      className="glass-morphism rounded-lg p-4 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all duration-200 group"
    >
      <div className="text-center">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
          {item.icon}
        </div>
        <div className="text-sm text-gray-300 mb-1">{item.name}</div>
        <div className="text-xs bg-purple-600 rounded-full px-2 py-1 font-medium">
          x{item.quantity}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventory Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-purple-300">Inventory</h3>
          <div
            className={`glass-morphism rounded-xl p-6 min-h-[400px] transition-all duration-200 ${
              dragState.isDragging ? 'border-purple-500 border-2 border-dashed' : ''
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('inventory')}
          >
            <div className="grid grid-cols-3 gap-4">
              {inventory.map((item) => (
                <ItemCard key={item.id} item={item} source="inventory" />
              ))}
            </div>
          </div>
        </div>

        {/* Crafting Table Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-purple-300">Crafting Table</h3>
          <div
            className={`glass-morphism rounded-xl p-6 min-h-[400px] transition-all duration-200 ${
              dragState.isDragging ? 'border-purple-500 border-2 border-dashed' : ''
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('crafting')}
          >
            <div className="grid grid-cols-3 gap-4">
              {craftingTable.map((item) => (
                <ItemCard key={item.id} item={item} source="crafting" />
              ))}
            </div>
            {craftingTable.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-600">
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Start Crafting
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag Instructions */}
      {dragState.isDragging && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded-lg shadow-lg z-50">
          Drop item to move between inventory and crafting table
        </div>
      )}
    </div>
  );
};
