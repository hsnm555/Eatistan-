import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Edit2, 
  Flame, 
  Tag, 
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { MenuItem, CategoryType } from '../types';
import { formatCurrency } from '../utils/receiptGenerator';

const MENU_CATEGORIES: { id: CategoryType; name: string; icon: string }[] = [
  { id: 'classic_pizza', name: 'Classic Pizza', icon: '🍕' },
  { id: 'specialty_pizza', name: 'Specialty Pizza', icon: '🧀' },
  { id: 'burgers', name: 'Burgers & Zingers', icon: '🍔' },
  { id: 'fried_chicken', name: 'Fried Chicken', icon: '🍗' },
  { id: 'wraps', name: 'Wraps & Rolls', icon: '🌯' },
  { id: 'pasta', name: 'Pasta & Noodles', icon: '🍝' },
  { id: 'sides', name: 'Fries & Sides', icon: '🍟' },
  { id: 'drinks', name: 'Beverages', icon: '🥤' }
];

interface MenuEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onUpdateMenuItem?: (updatedItem: MenuItem) => void;
  onUpdateItem?: (updatedItem: MenuItem) => void;
  onAddMenuItem?: (newItem: MenuItem) => void;
  onAddItem?: (newItem: MenuItem) => void;
  onDeleteMenuItem?: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
  onResetMenuToDefault?: () => void;
  onResetToDefault?: () => void;
}

export const MenuEditorModal: React.FC<MenuEditorModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onUpdateMenuItem,
  onUpdateItem,
  onAddMenuItem,
  onAddItem,
  onDeleteMenuItem,
  onDeleteItem,
  onResetMenuToDefault,
  onResetToDefault
}) => {
  if (!isOpen) return null;

  const handleUpdate = onUpdateItem || onUpdateMenuItem;
  const handleAdd = onAddItem || onAddMenuItem;
  const handleDelete = onDeleteItem || onDeleteMenuItem;
  const handleReset = onResetToDefault || onResetMenuToDefault;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  // State for inline editing an item
  const [editPrice, setEditPrice] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  
  // State for adding a brand new item
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('burgers');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsSpicy, setNewIsSpicy] = useState(false);
  const [newImage, setNewImage] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditPrice(item.basePrice.toString());
    setEditName(item.name);
    setEditDesc(item.description);
  };

  const handleSaveEdit = (originalItem: MenuItem) => {
    const priceNum = parseFloat(editPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price (greater than 0)');
      return;
    }
    if (!editName.trim()) {
      alert('Item name cannot be empty');
      return;
    }

    const updated: MenuItem = {
      ...originalItem,
      name: editName.trim(),
      basePrice: priceNum,
      description: editDesc.trim(),
    };

    if (handleUpdate) {
      handleUpdate(updated);
    }
    setEditingItemId(null);
    showNotification(`Saved changes to "${updated.name}" (Rs. ${priceNum})`);
  };

  const handleToggleAvailability = (item: MenuItem) => {
    const updated: MenuItem = {
      ...item,
      available: !item.available
    };
    if (handleUpdate) {
      handleUpdate(updated);
    }
    showNotification(`"${item.name}" marked as ${updated.available ? 'In Stock' : 'Out of Stock'}`);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice);
    if (!newName.trim() || isNaN(priceNum) || priceNum <= 0) {
      alert('Please provide item name and a valid price');
      return;
    }

    const defaultImages: Record<CategoryType, string> = {
      all: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60',
      classic_pizza: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60',
      specialty_pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
      burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
      fried_chicken: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60',
      wraps: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=60',
      pasta: 'https://images.unsplash.com/photo-1621996346565-e3d5d62816f1?w=500&auto=format&fit=crop&q=60',
      sides: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=60',
      drinks: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60',
      deals: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60'
    };

    const newItem: MenuItem = {
      id: `custom-item-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      basePrice: priceNum,
      description: newDesc.trim() || 'Freshly prepared item',
      available: true,
      isSpicy: newIsSpicy,
      image: newImage.trim() || defaultImages[newCategory] || defaultImages.burgers,
    };

    if (handleAdd) {
      handleAdd(newItem);
    }
    setNewName('');
    setNewPrice('');
    setNewDesc('');
    setNewIsSpicy(false);
    setNewImage('');
    setShowAddForm(false);
    showNotification(`Added new item "${newItem.name}" to menu!`);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.basePrice.toString().includes(searchTerm);
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-black shadow-md">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-400">
                  Menu & Price Manager
                </h2>
                <span className="bg-neutral-800 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-700">
                  POS Editable Catalog
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Update prices, mark items in/out of stock, or add new items. Changes save locally in offline POS storage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all menu items and prices back to standard factory catalog?')) {
                  onResetMenuToDefault();
                  showNotification('Reset menu back to factory defaults.');
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer"
              title="Reset prices & menu items to original defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback notification toast */}
        {feedbackMsg && (
          <div className="bg-emerald-500 text-black font-bold text-xs px-4 py-2 flex items-center justify-center gap-2 animate-fadeIn shadow-sm">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Controls Bar: Search, Category Filter & Add Item */}
        <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search food item by name or price..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Action: Add Item Button */}
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{showAddForm ? 'Close Add Form' : 'Add New Item'}</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-black'
                  : 'bg-black border border-neutral-700 text-neutral-400 hover:text-white'
              }`}
            >
              All ({menuItems.length})
            </button>
            {CATEGORIES.filter((c) => c.id !== 'all' && c.id !== 'deals').map((cat) => {
              const count = menuItems.filter((m) => m.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-black'
                      : 'bg-black border border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{cat.icon} {cat.name}</span>
                  <span className="ml-1 opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add New Item Expandable Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateNewItem}
            className="p-4 bg-black border-b border-amber-500/30 space-y-3 animate-fadeIn"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wide text-amber-400">
                + Create New Food / Drink Item
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crispy Patty Burger"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="burgers">🍔 Burgers</option>
                  <option value="classic_pizza">🍕 Classic Pizza</option>
                  <option value="specialty_pizza">🍕 Specialty Pizza</option>
                  <option value="fried_chicken">🍗 Fried Chicken / Broast</option>
                  <option value="wraps">🌯 Wraps & Rolls</option>
                  <option value="pasta">🍝 Pasta</option>
                  <option value="sides">🍟 Fries & Sides</option>
                  <option value="drinks">🥤 Drinks & Shakes</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">Selling Price (Rs.) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 350"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">Description / Ingredients</label>
                <input
                  type="text"
                  placeholder="e.g. Crisp fried fillet, garlic mayo, iceberg lettuce in toasted sesame bun"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs text-neutral-300 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsSpicy}
                    onChange={(e) => setNewIsSpicy(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>🌶️ Spicy Recipe</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Save to Menu
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Menu Items Table / Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-slate-950">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 text-neutral-500" />
              <p className="text-sm font-bold">No menu items found</p>
              <p className="text-xs text-neutral-500 mt-0.5">Try clearing filters or search query.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const isEditing = editingItemId === item.id;
                const isCustom = item.id.startsWith('custom-item-');

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      item.available
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        : 'bg-neutral-900/60 border-red-900/40 opacity-75'
                    }`}
                  >
                    {isEditing ? (
                      /* Inline Editing Form */
                      <div className="space-y-3 p-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-amber-400">
                            Editing Item: {item.name}
                          </span>
                          <span className="text-[10px] text-neutral-400 uppercase font-mono">
                            ID: {item.id}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-neutral-400 block mb-0.5">
                              Name
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-black border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-400 block mb-0.5">
                              Base Price (Rs.)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-full bg-black border border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-neutral-400 block mb-0.5">
                            Description
                          </label>
                          <input
                            type="text"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full bg-black border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(item)}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-sm cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Item Price</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Row */
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Left: Thumbnail + Title + Details */}
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-neutral-800 shrink-0 border border-neutral-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-white text-xs sm:text-sm">
                                {item.name}
                              </h4>
                              {item.isSpicy && (
                                <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.2 rounded font-semibold border border-red-800/40">
                                  🌶️ Spicy
                                </span>
                              )}
                              {isCustom && (
                                <span className="text-[10px] bg-blue-950 text-blue-400 px-1.5 py-0.2 rounded font-semibold border border-blue-800/40">
                                  Custom Item
                                </span>
                              )}
                              {!item.available && (
                                <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full">
                                  Sold Out / Inactive
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Right: Price, Availability Toggle & Edit Buttons */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                          {/* Price Tag with click to edit */}
                          <div
                            onClick={() => handleStartEdit(item)}
                            className="cursor-pointer group flex items-center gap-1.5 bg-black hover:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700 hover:border-amber-400 transition-colors"
                            title="Click to edit price"
                          >
                            <span className="text-xs text-neutral-400">Price:</span>
                            <span className="font-mono font-black text-amber-400 text-sm">
                              {formatCurrency(item.basePrice)}
                            </span>
                            <Edit2 className="w-3 h-3 text-neutral-400 group-hover:text-amber-400 ml-1" />
                          </div>

                          {/* In-Stock / Out-of-Stock Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              item.available
                                ? 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300'
                                : 'bg-red-950/80 hover:bg-red-900 border border-red-600/40 text-red-300'
                            }`}
                            title={item.available ? 'Click to mark as Out of Stock' : 'Click to mark as In Stock'}
                          >
                            {item.available ? 'In Stock' : 'Out of Stock'}
                          </button>

                          {/* Edit Details Button */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit title & price"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete if custom item */}
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete custom item "${item.name}" from menu?`)) {
                                  onDeleteMenuItem(item.id);
                                  showNotification(`Removed "${item.name}" from menu.`);
                                }
                              }}
                              className="p-1.5 rounded-xl hover:bg-red-950/60 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete custom menu item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-black border-t border-slate-800 flex items-center justify-between text-xs text-neutral-400">
          <span>
            Total Items: <strong className="text-white">{menuItems.length}</strong> (
            <span className="text-emerald-400">{menuItems.filter((i) => i.available).length} Active</span>,{' '}
            <span className="text-red-400">{menuItems.filter((i) => !i.available).length} Sold Out</span>)
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
