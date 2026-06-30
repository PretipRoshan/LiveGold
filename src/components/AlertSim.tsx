import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertTriangle, ListFilter, Info } from 'lucide-react';


import { AlertLog, SignalType } from '../types';

interface AlertSimProps {
  logs: AlertLog[];
  onDispatchAlert: (target: string, message: string) => Promise<void>;
  currentSignal: SignalType;
  currentPrice: number;
}

export default function AlertSim({ logs, onDispatchAlert, currentSignal, currentPrice }: AlertSimProps) {
  const [targetContact, setTargetContact] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [notifTrigger, setNotifTrigger] = useState(false);


  const getAutoDraftMessage = () => {
    return `[XAU/USD ALERT] Gold Decision Support System generated a *NEW* signal: **${currentSignal}**. Current Price: $${currentPrice}/oz. Reasoning: Evaluated rules verify indicator compliance. Education purposes only.`;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const contact = targetContact.trim() || 'student@southern.edu.my';
    const msg = customMsg.trim() || getAutoDraftMessage();

    setIsSending(true);
    await onDispatchAlert(contact, msg);
    setIsSending(false);

    // reset/flicker success state
    setNotifTrigger(true);
    setTimeout(() => setNotifTrigger(false), 3000);
    setCustomMsg('');
  };

  return (
    <div className="bg-[#12141A] rounded-2xl border border-[#2A2D35] shadow-2xl p-6 animate-fade-in" id="alerts-sim-module">
      <div className="mb-5">
        <h3 className="font-sans font-bold text-white text-base" id="alerts-sim-title">Email Alert Simulator</h3>
        <p className="text-xs text-[#848E9C] mt-1.5 font-sans font-normal" id="alerts-sim-desc">
          Section 6.0 proposed email alert trigger pipeline for alert automation when signals shift.
        </p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="alerts-sim-grid">
        {/* Form Configuration Field (Left 5-columns) */}
        <form onSubmit={handleSend} className="lg:col-span-5 space-y-4 font-sans" id="alert-dispatch-form">
          <div>
            <label className="block text-xs font-bold text-[#848E9C] uppercase tracking-wider mb-2">
              Notification Channel
            </label>
            <div className="flex items-center space-x-2 p-2.5 rounded-lg border border-[#F0B90B] bg-[#F0B90B]/10 text-xs text-[#F0B90B] font-bold">
              <Mail className="w-4 h-4" />
              <span>SMTP Email</span>
            </div>
          </div>


          <div>
            <label className="block text-xs font-bold text-[#848E9C] uppercase tracking-wider mb-2" id="receiver-field-label">
              Receiver Email Address
            </label>
            <input
              type="text"
              value={targetContact}
              onChange={(e) => setTargetContact(e.target.value)}
              placeholder={'e.g., analyst@southern.edu.my'}
              className="w-full text-xs p-3 bg-[#0F1115] border border-[#2A2D35] rounded-lg focus:outline-none focus:border-[#F0B90B] text-white placeholder-[#474D57]"
              id="alert-target-input"
            />
            <p className="text-[10px] text-[#848E9C] mt-2" id="input-help-lbl">
              *Leave blank to trigger Southern University representative default credentials.
            </p>
          </div>


          <div>
            <label className="block text-xs font-bold text-[#848E9C] uppercase tracking-wider mb-2">
              Custom Body Message
            </label>
            <textarea
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={`Draft automatically:\n"${getAutoDraftMessage()}"`}
              rows={3}
              className="w-full text-xs p-3 bg-[#0F1115] border border-[#2A2D35] rounded-lg focus:outline-none focus:border-[#F0B90B] text-white placeholder-[#474D57] resize-none leading-relaxed"
              id="alert-message-input"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-[#F0B90B] hover:bg-[#DFAB0A] text-[#0A0B0D] font-bold rounded-lg text-xs transition cursor-pointer disabled:opacity-50"
            id="dispatch-alert-submit"
          >
            {isSending ? (
              <span>Queueing SMTP relays...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Emit Real-time Alert Node</span>
              </>
            )}
          </button>

          {notifTrigger && (
              <div className="p-3 bg-[#14261F] rounded-lg border border-[#0ECB81]/30 flex items-center space-x-2 text-xs text-[#0ECB81] fade-in" id="alert-success-notif">
              <CheckCircle2 className="w-4 h-4 text-[#0ECB81]" />
              <span>Broadcast dispatched successfully! System processed SMTP sockets.</span>
            </div>

          )}
        </form>

        {/* Logs Auditor Section (Right 7-columns) */}
        <div className="lg:col-span-7 flex flex-col border border-[#2A2D35] rounded-xl bg-[#0F1115]/30" id="alert-audit-panel">
          <div className="p-3.5 border-b border-[#2A2D35] flex items-center justify-between bg-[#0F1115]/80" id="audit-header">
            <div className="flex items-center space-x-2">
              <ListFilter className="w-4 h-4 text-[#848E9C]" />
              <span className="font-sans font-bold text-xs text-white">Dispatcher Logs & Relational Auditing</span>
            </div>
            <span className="font-mono text-[10px] bg-[#1E2129] border border-[#2A2D35] text-[#848E9C] px-2.5 py-1 rounded" id="logs-count">
              {logs.length} logged pulses
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[310px] p-4 space-y-3" id="logs-feed-container">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#848E9C] font-sans" id="no-logs-view">
                <Info className="w-7 h-7 text-[#474D57] mb-1.5" />
                <p className="text-xs font-bold text-white">No notifications emitted in standard logs yet.</p>
                <p className="text-[10px] mt-1 text-[#848E9C]">Trigger standard alarms via the left form inputs.</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-3 bg-[#0F1115] rounded-lg border border-[#2A2D35] space-y-2 hover:border-[#F0B90B]/30 hover:shadow-xs transition" id={`log-item-${log.id}`}>
                  <div className="flex items-center justify-between text-[11px] font-sans">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 border border-[#2A2D35] rounded font-mono font-bold uppercase text-[9px] ${
                        'bg-[#2B2816] text-[#F0B90B] border-[#F0B90B]/20'
                      }`} id={`log-badge-${log.id}`}>
                        {log.type}
                      </span>

                      <span className="text-[#848E9C] font-mono truncate max-w-[150px]" id={`log-target-${log.id}`}>
                        To: {log.target}
                      </span>
                    </div>
                    <span className="text-[#848E9C] font-mono text-[9px]" id={`log-time-${log.id}`}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#E0E0E0] font-normal leading-relaxed text-justify" id={`log-msg-${log.id}`}>
                    {log.message}
                  </p>
                  <div className="flex items-center justify-end text-[10px] text-[#0ECB81] font-sans font-semibold" id={`log-status-block-${log.id}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>Socket State: Secure Sent (202 OK)</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
