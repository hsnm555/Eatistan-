import React from 'react';
import { DailyDeal } from '../types';
import { Sparkles, Check, Flame, ArrowRight, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/receiptGenerator';

interface DailyDealsSectionProps {
  deals: DailyDeal[];
  onAddDeal: (deal: DailyDeal) => void;
  onApplyCouponCode: (code: string) => void;
  activeCoupon?: string;
}

export const DailyDealsSection: React.FC<DailyDealsSectionProps> = ({
  deals,
  onAddDeal,
  onApplyCouponCode,
  activeCoupon
}) => {
  const [addedDealId, setAddedDealId] = React.useState<string | null>(null);

  const handleAdd = (deal: DailyDeal) => {
    onAddDeal(deal);
    setAddedDealId(deal.id);
    setTimeout(() => setAddedDealId(null), 1200);
  };

  return (
    <section className="mb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Chef's Special Offers
            </span>
            <span className="text-xs text-slate-500 font-medium">Limited Time Today</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            🔥 Daily Deals & Combos
          </h2>
        </div>

        {/* Promo code quick pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" /> Codes:
          </span>
          <button
            type="button"
            onClick={() => onApplyCouponCode('AZADI')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-bold transition-colors cursor-pointer ${
              activeCoupon === 'AZADI'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            AZADI (14% OFF)
          </button>
          <button
            type="button"
            onClick={() => onApplyCouponCode('FRIDAY')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-bold transition-colors cursor-pointer ${
              activeCoupon === 'FRIDAY'
                ? 'bg-orange-600 text-white border-orange-700'
                : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100'
            }`}
          >
            FRIDAY (-Rs.200)
          </button>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deals.map((deal) => {
          const savings = deal.originalPrice - deal.dealPrice;
          const isAdded = addedDealId === deal.id;

          return (
            <div
              key={deal.id}
              id={`daily-deal-card-${deal.id}`}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Highlight ribbon */}
              <div className="absolute top-3 right-3 z-10">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-white" />
                  Save {formatCurrency(savings)}
                </span>
              </div>

              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-slate-100 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="pr-12">
                    <span className="inline-block text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 mb-1">
                      {deal.tag}
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                      {deal.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      {deal.subtitle}
                    </p>
                  </div>
                </div>

                {/* Items Included List */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 bg-slate-50/70 p-2.5 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Items Included in Bundle:
                  </div>
                  <ul className="space-y-1">
                    {deal.itemsIncluded.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="mt-4 pt-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      {formatCurrency(deal.dealPrice)}
                    </span>
                    <span className="text-xs text-slate-400 line-through font-semibold">
                      {formatCurrency(deal.originalPrice)}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-bold">
                    {deal.validTag}
                  </div>
                </div>

                <button
                  type="button"
                  id={`btn-add-deal-${deal.id}`}
                  onClick={() => handleAdd(deal)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-slate-950 font-extrabold'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Bill!</span>
                    </>
                  ) : (
                    <>
                      <span>Apply Deal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
