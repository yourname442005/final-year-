'use client';

import React from 'react';
import { Bell, Check, Trash2, Sparkles, FolderKanban, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { usePlatformStore } from '@/lib/platform-store';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = usePlatformStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'citation':
        return <Sparkles className="w-4 h-4 text-[#d97757]" />;
      case 'collab':
        return <FolderKanban className="w-4 h-4 text-emerald-600" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-amber-600" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#87867f]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Banner */}
      <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-[24px] p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1">
            <Bell className="w-3.5 h-3.5" /> Platform Notifications
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#141413]">
            Academic Activity Center
          </h1>
          <p className="font-serif text-sm text-[#141413]/85 leading-relaxed max-w-xl">
            Track citations of your manuscripts, collaborator invitations, peer comments, and verification updates.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="btn-outlined-dark py-2 px-4 text-xs font-sans flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => !n.read && markNotificationRead(n.id)}
            className={`p-4 rounded-2xl border transition-colors flex items-start justify-between gap-4 cursor-pointer ${
              n.read
                ? 'bg-[#faf9f5] border-[#cccbc8] opacity-80'
                : 'bg-[#f0eee6] border-[#d97757] shadow-2xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#faf9f5] border border-[#cccbc8] mt-0.5 shrink-0">
                {getIcon(n.type)}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-base font-bold text-[#141413]">{n.title}</h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#d97757]" />
                  )}
                </div>
                <p className="font-serif text-xs text-[#141413]/90">{n.message}</p>
                <span className="font-sans text-[10px] text-[#87867f] block pt-1">{n.timestamp}</span>
              </div>
            </div>

            {!n.read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markNotificationRead(n.id);
                }}
                className="font-sans text-xs text-[#d97757] hover:underline flex items-center gap-1 shrink-0"
              >
                <Check className="w-3.5 h-3.5" /> Mark read
              </button>
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-12 text-center space-y-2">
            <Bell className="w-10 h-10 text-[#87867f] mx-auto" />
            <h3 className="font-serif text-xl font-normal text-[#141413]">
              No notifications
            </h3>
            <p className="font-serif text-xs text-[#87867f]">
              You&apos;re all caught up! New citations or peer updates will appear here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
