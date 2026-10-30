import React, { useState } from 'react';
import { appStore } from '../services/store';
import { DirectMessage, NotificationItem, User } from '../types';
import { DiamondBadge } from './DiamondBadge';
import {
  MessageSquare,
  Bell,
  Heart,
  Gift,
  Radio,
  ShieldAlert,
  Send,
  Users,
  Search,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const [selectedUser, setSelectedUser] = useState<User>(appStore.users[1]); // Apex
  const [inputText, setInputText] = useState('');

  const currentUser = appStore.currentUser;
  const messages = appStore.messages;
  const notifications = appStore.notifications;

  const currentConvo = messages.filter(
    m =>
      (m.senderId === currentUser.id && m.receiverId === selectedUser.id) ||
      (m.senderId === selectedUser.id && m.receiverId === currentUser.id)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    appStore.messages.push({
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      text: inputText.trim(),
      timestamp: Date.now(),
      read: true
    });

    setInputText('');
    appStore.notify();
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-120px)] bg-white pb-16">
      {/* Tab Switcher */}
      <div className="flex items-center border-b border-purple-50 bg-white px-4 py-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'messages'
              ? 'border-purple-700 text-purple-900 font-extrabold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Direct Messages</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'notifications'
              ? 'border-purple-700 text-purple-900 font-extrabold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
          {notifications.some(n => !n.read) && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {activeTab === 'messages' ? (
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Creators List */}
          <div className="w-full sm:w-64 border-r border-gray-100 overflow-y-auto divide-y divide-gray-50 max-h-48 sm:max-h-full">
            {appStore.users
              .filter(u => u.id !== currentUser.id)
              .map(u => {
                const isSelected = selectedUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${
                      isSelected ? 'bg-purple-50/80 border-l-4 border-purple-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-purple-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-gray-900 truncate">
                          {u.displayName}
                        </span>
                        <DiamondBadge level={u.gifterLevel} size="sm" />
                      </div>
                      <span className="text-[11px] text-gray-400 truncate block">
                        @{u.username}
                      </span>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Active Conversation Pane */}
          <div className="flex-1 flex flex-col justify-between bg-gray-50/50">
            {/* Header */}
            <div className="p-3 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <span className="font-bold text-xs text-gray-900">{selectedUser.displayName}</span>
                  <span className="text-[10px] text-emerald-600 block">● Active Now</span>
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {currentConvo.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs font-medium shadow-sm ${
                        isMe
                          ? 'bg-purple-700 text-white rounded-br-none'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={`Message ${selectedUser.displayName}...`}
                className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-purple-700 hover:bg-purple-800 text-white shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Notifications Tab */
        <div className="flex-1 p-4 overflow-y-auto divide-y divide-gray-100">
          {notifications.map(notif => (
            <div key={notif.id} className="py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                {notif.type === 'gift' ? (
                  <Gift className="w-4 h-4 text-amber-500" />
                ) : notif.type === 'live_invite' ? (
                  <Radio className="w-4 h-4 text-purple-600" />
                ) : (
                  <Heart className="w-4 h-4 text-rose-500" />
                )}
              </div>
              <div className="flex-1 text-xs">
                <span className="font-extrabold text-gray-900 block">{notif.title}</span>
                <p className="text-gray-600 mt-0.5">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
