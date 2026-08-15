'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Users,
  FileText,
  CheckSquare,
  Sparkles,
  Paperclip,
  Database,
  MessageSquare,
  Send,
  UserPlus,
  Clock,
  Layers,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';

interface TimeAllocationData {
  paper: string;
  fullName: string;
  hours: number;
}
import { usePlatformStore } from '@/lib/platform-store';
import { PaperCard } from '../PaperCard';
import { Paper, WorkspaceProject } from '@/lib/mock-data';

interface WorkspaceViewProps {
  onOpenNewProject: () => void;
  onOpenPaperDetail: (paper: Paper) => void;
  onOpenCite: (paper: Paper) => void;
  onOpenAddToCollection: (paper: Paper) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  onOpenNewProject,
  onOpenPaperDetail,
  onOpenCite,
  onOpenAddToCollection
}) => {
  const {
    projects,
    papers,
    user,
    addTaskToProject,
    updateTaskStatus,
    addNoteToProject,
    addProjectDiscussion,
    inviteCollaborator
  } = usePlatformStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'Overview' | 'Papers' | 'Notes' | 'Tasks' | 'Datasets' | 'Discussion' | 'AI Assistant'>('Overview');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Note form state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notePaperId, setNotePaperId] = useState('');

  // Discussion state
  const [discMsg, setDiscMsg] = useState('');

  // Invite state
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Owner' | 'Editor' | 'Viewer'>('Editor');

  // AI Assistant Chat in Workspace
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([
    {
      sender: 'assistant',
      text: 'Hello! I am your AI Workspace Assistant. I have context on your project documents, notes, and saved research papers. How can I help with your literature synthesis or task pipeline?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  if (!project) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-[24px] p-12 text-center space-y-4">
          <FolderKanban className="w-12 h-12 text-[#d97757] mx-auto" />
          <h2 className="font-serif text-2xl font-normal text-[#141413]">
            No Research Workspaces Found
          </h2>
          <p className="font-serif text-sm text-[#87867f] max-w-md mx-auto">
            Start a research project to organize papers, notes, task pipelines, and collaborate with co-authors.
          </p>
          <button onClick={onOpenNewProject} className="btn-clay py-2.5 px-6 font-sans text-xs inline-flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Create First Project</span>
          </button>
        </div>
      </div>
    );
  }

  const projectPapers = papers.filter((p) => project.paperIds.includes(p.id));

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTaskToProject(project.id, taskTitle.trim(), taskDueDate, user.name);
    setTaskTitle('');
    setTaskDueDate('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    addNoteToProject(project.id, noteTitle.trim(), noteContent.trim(), notePaperId || undefined);
    setNoteTitle('');
    setNoteContent('');
    setNotePaperId('');
    setIsAddingNote(false);
  };

  const handleSendDisc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discMsg.trim()) return;
    addProjectDiscussion(project.id, discMsg);
    setDiscMsg('');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteCollaborator(project.id, inviteEmail.trim(), inviteRole);
    setInviteEmail('');
    setIsInviting(false);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          projectContext: {
            name: project.name,
            field: project.field,
            description: project.description,
            paperTitles: projectPapers.map((p) => p.title)
          },
          conversationHistory: chatMessages.map((m) => ({
            sender: m.sender === 'user' ? 'Researcher' : 'AI Assistant',
            text: m.text
          }))
        })
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages((prev) => [...prev, { sender: 'assistant', text: data.reply }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const completedTasksCount = project.tasks.filter((t) => t.status === 'Done').length;
  const progressPercent = project.tasks.length > 0 ? Math.round((completedTasksCount / project.tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Bar with Project Selector */}
      <div className="bg-[#f5e3c7] border border-[#cccbc8] rounded-[24px] p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757]">
              Research Workspace & Collaboration
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-[#faf9f5] border border-[#cccbc8] rounded-xl px-3 py-1.5 font-serif text-xl font-medium text-[#141413] focus:outline-none focus:border-[#d97757]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={onOpenNewProject} className="btn-clay text-xs py-2 px-4 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>New Workspace Project</span>
          </button>
        </div>

        <p className="font-serif text-sm text-[#141413]/85 leading-relaxed">
          {project.description}
        </p>

        {/* Project Meta Info */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-[#cccbc8]/60 font-sans text-xs text-[#87867f]">
          <div className="flex items-center gap-4 flex-wrap">
            <span>Discipline: <strong className="text-[#141413] font-semibold">{project.field}</strong></span>
            <span>Papers: <strong className="text-[#141413] font-semibold">{project.paperIds.length}</strong></span>
            <span>Notes: <strong className="text-[#141413] font-semibold">{project.notes.length}</strong></span>
            <span>Tasks Progress: <strong className="text-[#141413] font-semibold">{progressPercent}%</strong></span>
          </div>

          {/* Members Avatars & Invite */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {project.members.map((mem, idx) => (
                <img
                  key={idx}
                  src={mem.avatar}
                  alt={mem.name}
                  title={`${mem.name} (${mem.role})`}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-[#faf9f5] object-cover"
                />
              ))}
            </div>
            <button
              onClick={() => setIsInviting(!isInviting)}
              className="btn-outlined-dark text-xs py-1 px-2.5 flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#d97757]" />
              <span>Invite</span>
            </button>
          </div>
        </div>

        {/* Invite Form Drawer */}
        {isInviting && (
          <form onSubmit={handleInviteSubmit} className="bg-[#faf9f5] p-3 rounded-xl border border-[#cccbc8] flex items-center gap-2 flex-wrap">
            <input
              type="email"
              required
              placeholder="Collaborator email (e.g. s.torres@ub.edu)"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="p-2 bg-[#f0eee6] border border-[#cccbc8] rounded-lg text-xs font-sans text-[#141413] flex-1 focus:outline-none focus:border-[#d97757]"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="p-2 bg-[#f0eee6] border border-[#cccbc8] rounded-lg text-xs font-sans text-[#141413]"
            >
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
              <option value="Owner">Co-Owner</option>
            </select>
            <button type="submit" className="btn-clay text-xs py-2 px-3">
              Send Invite
            </button>
          </form>
        )}
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex border-b border-[#cccbc8] gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'Overview', label: 'Overview & Progress' },
          { id: 'Papers', label: `Papers (${project.paperIds.length})` },
          { id: 'Notes', label: `Notes (${project.notes.length})` },
          { id: 'Tasks', label: `Task Pipeline (${project.tasks.length})` },
          { id: 'Datasets', label: 'Datasets & Files' },
          { id: 'Discussion', label: 'Discussion Thread' },
          { id: 'AI Assistant', label: 'AI Workspace Chat' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`font-sans text-xs px-4 py-2.5 font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? 'border-[#d97757] text-[#d97757] font-semibold'
                : 'border-transparent text-[#87867f] hover:text-[#141413]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub Tab Content */}

      {/* 1. OVERVIEW */}
      {activeSubTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-5 space-y-1">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#87867f]">
                Pipeline Completion
              </span>
              <p className="font-serif text-3xl font-normal text-[#141413]">
                {progressPercent}%
              </p>
              <div className="w-full bg-[#f0eee6] h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-[#d97757] h-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-5 space-y-1">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#87867f]">
                Total Time Invested
              </span>
              <p className="font-serif text-3xl font-normal text-[#141413]">
                31 hrs
              </p>
              <p className="font-serif text-xs text-[#87867f] pt-1">Across active research papers</p>
            </div>

            <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-5 space-y-1">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#87867f]">
                Team Members
              </span>
              <p className="font-serif text-3xl font-normal text-[#141413]">
                {project.members.length}
              </p>
              <p className="font-serif text-xs text-[#87867f] pt-1">Owner: {project.ownerName}</p>
            </div>
          </div>

          {/* Research Time Allocation Chart */}
          <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#cccbc8]/60 pb-4">
              <div className="space-y-1">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d97757] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Time Analytics
                </span>
                <h3 className="font-serif text-xl font-medium text-[#141413]">
                  Research Time Allocation
                </h3>
                <p className="font-serif text-xs text-[#87867f]">
                  Track how your research time is distributed across active papers.
                </p>
              </div>
              <div className="bg-[#f0eee6] border border-[#cccbc8] px-3.5 py-1.5 rounded-xl font-sans text-xs text-[#141413]">
                <span className="text-[#87867f]">Total Time: </span>
                <strong className="font-bold text-[#d97757]">31 hrs</strong>
              </div>
            </div>

            {/* Vertical Bar Chart Visualization */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      paper: projectPapers[0] ? (projectPapers[0].title.length > 25 ? projectPapers[0].title.slice(0, 25) + '...' : projectPapers[0].title) : 'Research Paper X',
                      fullName: projectPapers[0]?.title || 'Research Paper X',
                      hours: 15
                    },
                    {
                      paper: projectPapers[1] ? (projectPapers[1].title.length > 25 ? projectPapers[1].title.slice(0, 25) + '...' : projectPapers[1].title) : 'Research Paper Y',
                      fullName: projectPapers[1]?.title || 'Research Paper Y',
                      hours: 10
                    },
                    {
                      paper: projectPapers[2] ? (projectPapers[2].title.length > 25 ? projectPapers[2].title.slice(0, 25) + '...' : projectPapers[2].title) : 'Research Paper Z',
                      fullName: projectPapers[2]?.title || 'Research Paper Z',
                      hours: 6
                    }
                  ]}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#cccbc8" horizontal={false} opacity={0.5} />
                  <XAxis
                    type="number"
                    stroke="#87867f"
                    fontSize={11}
                    tickFormatter={(val) => `${val}h`}
                    label={{ value: 'Hours Invested', position: 'insideBottom', offset: -10, fill: '#87867f', fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="paper"
                    stroke="#87867f"
                    fontSize={11}
                    width={180}
                    tickLine={false}
                    axisLine={{ stroke: '#cccbc8' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(217, 119, 87, 0.08)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#141413] text-[#faf9f5] p-3 rounded-xl shadow-lg border border-[#cccbc8]/30 font-sans text-xs space-y-1">
                            <p className="font-serif font-bold text-[#faf9f5]">{data.fullName}</p>
                            <div className="flex items-center justify-between gap-4 text-[11px] text-[#e3dacc]">
                              <span>Hours Invested:</span>
                              <span className="font-bold text-[#d97757]">{data.hours} hrs</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="hours" radius={[0, 8, 8, 0]} barSize={24}>
                    <Cell fill="#d97757" />
                    <Cell fill="#c86847" />
                    <Cell fill="#b85837" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAPERS */}
      {activeSubTab === 'Papers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-normal text-[#141413]">
              Workspace Literature Collection
            </h3>
          </div>

          {projectPapers.length > 0 ? (
            <div className="space-y-4">
              {projectPapers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  onOpenDetail={onOpenPaperDetail}
                  onOpenCite={onOpenCite}
                  onOpenAddToCollection={onOpenAddToCollection}
                  showRelevanceSignal={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-8 text-center space-y-2">
              <p className="font-serif text-sm text-[#87867f]">No papers associated with this workspace project yet.</p>
            </div>
          )}
        </div>
      )}

      {/* 3. NOTES */}
      {activeSubTab === 'Notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-normal text-[#141413]">
              Research Notes & Annotations
            </h3>
            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="btn-clay text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          </div>

          {/* New Note Form */}
          {isAddingNote && (
            <form onSubmit={handleAddNote} className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-5 space-y-3">
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#141413]">
                Create Project Research Note
              </h4>
              <input
                type="text"
                required
                placeholder="Note Title (e.g. Gateway Latent Routing Ablation Observation)"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
              />
              <textarea
                rows={4}
                required
                placeholder="Write detailed observations, formula derivations, or paper annotations..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full p-3 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-sm font-serif text-[#141413]"
              />
              <div>
                <label className="font-sans text-xs text-[#87867f] block mb-1">Link to Paper (Optional):</label>
                <select
                  value={notePaperId}
                  onChange={(e) => setNotePaperId(e.target.value)}
                  className="w-full p-2 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
                >
                  <option value="">No paper linked</option>
                  {papers.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddingNote(false)} className="btn-outlined-dark text-xs py-1.5 px-3">
                  Cancel
                </button>
                <button type="submit" className="btn-clay text-xs py-1.5 px-4">
                  Save Note
                </button>
              </div>
            </form>
          )}

          {/* Notes List */}
          <div className="space-y-4">
            {project.notes.map((note) => (
              <div key={note.id} className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-serif text-lg font-medium text-[#141413]">
                    {note.title}
                  </h4>
                  <span className="font-sans text-xs text-[#87867f]">
                    By {note.authorName} • {note.updatedAt}
                  </span>
                </div>

                <p className="font-serif text-sm text-[#141413]/90 leading-relaxed">
                  {note.content}
                </p>

                {note.paperTitle && (
                  <div className="pt-2">
                    <span className="font-sans text-xs bg-[#e3dacc] text-[#141413] px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1">
                      <Paperclip className="w-3 h-3 text-[#d97757]" /> {note.paperTitle}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TASKS */}
      {activeSubTab === 'Tasks' && (
        <div className="space-y-6">
          {/* Add Task Input */}
          <form onSubmit={handleAddTask} className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-4 flex items-center gap-3 flex-wrap">
            <input
              type="text"
              required
              placeholder="New Task Title (e.g., Run operando noise evaluation on Gateway)"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413] flex-1 focus:outline-none focus:border-[#d97757]"
            />
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              className="p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-sans text-[#141413]"
            />
            <button type="submit" className="btn-clay text-xs py-2.5 px-5 flex items-center gap-1">
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </form>

          {/* Kanban Board Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['Todo', 'In Progress', 'Done'] as const).map((colStatus) => {
              const colTasks = project.tasks.filter((t) => t.status === colStatus);
              return (
                <div key={colStatus} className="bg-[#f0eee6] border border-[#cccbc8] rounded-2xl p-4 space-y-3 min-h-[300px]">
                  <div className="flex items-center justify-between border-b border-[#cccbc8] pb-2">
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#141413]">
                      {colStatus}
                    </span>
                    <span className="font-sans text-xs text-[#87867f] font-semibold bg-[#faf9f5] px-2 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {colTasks.map((t) => (
                      <div key={t.id} className="bg-[#faf9f5] border border-[#cccbc8] rounded-xl p-3 space-y-2 shadow-2xs">
                        <p className="font-serif text-sm font-medium text-[#141413]">
                          {t.title}
                        </p>
                        <div className="flex items-center justify-between text-xs font-sans text-[#87867f]">
                          <span>{t.assigneeName}</span>
                          <span>{t.dueDate}</span>
                        </div>

                        {/* Move status buttons */}
                        <div className="flex items-center justify-end gap-1 pt-1 border-t border-[#cccbc8]/40">
                          {colStatus !== 'Todo' && (
                            <button
                              onClick={() => updateTaskStatus(project.id, t.id, 'Todo')}
                              className="font-sans text-[10px] text-[#87867f] hover:text-[#141413] px-1.5 py-0.5"
                            >
                              ← Todo
                            </button>
                          )}
                          {colStatus !== 'In Progress' && (
                            <button
                              onClick={() => updateTaskStatus(project.id, t.id, 'In Progress')}
                              className="font-sans text-[10px] text-[#d97757] hover:underline px-1.5 py-0.5"
                            >
                              Progress
                            </button>
                          )}
                          {colStatus !== 'Done' && (
                            <button
                              onClick={() => updateTaskStatus(project.id, t.id, 'Done')}
                              className="font-sans text-[10px] text-emerald-700 hover:underline px-1.5 py-0.5 font-bold"
                            >
                              Done ✓
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. DATASETS */}
      {activeSubTab === 'Datasets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-normal text-[#141413]">
              Project Datasets & Replicated Files
            </h3>
          </div>

          <div className="space-y-3">
            {project.datasets.map((d) => (
              <div key={d.id} className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#d97757]" />
                    <h4 className="font-sans text-base font-bold text-[#141413]">{d.name}</h4>
                    <span className="font-sans text-xs bg-[#e3dacc] text-[#141413] px-2 py-0.5 rounded font-medium">
                      {d.format}
                    </span>
                  </div>
                  <p className="font-serif text-xs text-[#87867f]">{d.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-sans text-xs text-[#87867f]">Size: {d.size}</span>
                  <a
                    href={d.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outlined-dark text-xs py-1.5 px-3 no-underline"
                  >
                    Access Data
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. DISCUSSION */}
      {activeSubTab === 'Discussion' && (
        <div className="space-y-6">
          <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-5 space-y-4">
            <h3 className="font-serif text-xl font-normal text-[#141413]">
              Team Discussion Thread
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {project.discussions.map((msg) => (
                <div key={msg.id} className="bg-[#f0eee6] p-3.5 rounded-xl border border-[#cccbc8] space-y-1">
                  <div className="flex items-center justify-between font-sans text-xs text-[#87867f]">
                    <span className="font-bold text-[#141413]">{msg.authorName}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="font-serif text-sm text-[#141413]">{msg.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendDisc} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Write a message to team members..."
                value={discMsg}
                onChange={(e) => setDiscMsg(e.target.value)}
                className="flex-1 p-2.5 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-serif text-[#141413] focus:outline-none focus:border-[#d97757]"
              />
              <button type="submit" className="btn-clay text-xs py-2.5 px-5 flex items-center gap-1">
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. AI ASSISTANT CHAT */}
      {activeSubTab === 'AI Assistant' && (
        <div className="bg-[#faf9f5] border border-[#cccbc8] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d97757]" />
            <h3 className="font-serif text-xl font-normal text-[#141413]">
              AI Research Assistant
            </h3>
          </div>
          <p className="font-serif text-xs text-[#87867f]">
            Ask questions regarding project literature, methodological synthesis, or paper citations.
          </p>

          <div className="bg-[#f0eee6] border border-[#cccbc8] rounded-2xl p-4 space-y-3 min-h-[250px] max-h-[400px] overflow-y-auto">
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl max-w-2xl text-xs font-serif leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#141413] text-[#faf9f5] ml-auto'
                    : 'bg-[#faf9f5] text-[#141413] border border-[#cccbc8]'
                }`}
              >
                <span className="font-sans text-[10px] uppercase font-bold block mb-1 opacity-70">
                  {m.sender === 'user' ? 'Researcher' : 'AI Assistant'}
                </span>
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI Assistant about paper methodologies or project tasks..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 p-3 bg-[#f0eee6] border border-[#cccbc8] rounded-xl text-xs font-serif text-[#141413] focus:outline-none focus:border-[#d97757]"
            />
            <button
              type="submit"
              disabled={isChatLoading}
              className="btn-clay text-xs py-3 px-5 flex items-center gap-1.5"
            >
              {isChatLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Ask AI</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
