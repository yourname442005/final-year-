import { useState, useEffect } from 'react';
import {
  Paper,
  Researcher,
  FeedPost,
  Collection,
  Task,
  WorkspaceProject,
  NotificationItem,
  TrendingTopic,
  ManuscriptSubmission,
  INITIAL_PAPERS,
  INITIAL_RESEARCHERS,
  INITIAL_FEED_POSTS,
  INITIAL_COLLECTIONS,
  INITIAL_PROJECTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRENDING_TOPICS,
  INITIAL_MANUSCRIPTS
} from './mock-data';

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  institution: string;
  field: string;
  bio: string;
  avatar: string;
  verified: boolean;
  interests: string[];
  email: string;
}

const DEFAULT_USER: UserProfile = {
  id: 'current-user',
  name: 'Dr. Amara Nwosu',
  title: 'Principal AI Researcher',
  institution: 'Independent Research Institute',
  field: 'Computational Linguistics & AI Reasoning',
  bio: 'Independent researcher focusing on multimodal reasoning architectures, adaptive transformer routing, and causal physics engines.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  verified: true,
  interests: ['Multimodal Transformers', 'Causal AI', 'Symbolic Reasoning', 'Open Weights'],
  email: 'amara.nwosu@research-inst.org'
};

const STORAGE_KEY = 'ai_native_research_platform_state_v1';

interface PlatformState {
  user: UserProfile;
  savedPaperIds: string[];
  papers: Paper[];
  researchers: Researcher[];
  feedPosts: FeedPost[];
  collections: Collection[];
  projects: WorkspaceProject[];
  notifications: NotificationItem[];
  trendingTopics: TrendingTopic[];
  manuscripts: ManuscriptSubmission[];
  searchHistory: string[];
}

const getInitialState = (): PlatformState => {
  if (typeof window === 'undefined') {
    return {
      user: DEFAULT_USER,
      savedPaperIds: ['paper-101', 'paper-104'],
      papers: INITIAL_PAPERS,
      researchers: INITIAL_RESEARCHERS,
      feedPosts: INITIAL_FEED_POSTS,
      collections: INITIAL_COLLECTIONS,
      projects: INITIAL_PROJECTS,
      notifications: INITIAL_NOTIFICATIONS,
      trendingTopics: INITIAL_TRENDING_TOPICS,
      manuscripts: INITIAL_MANUSCRIPTS,
      searchHistory: ['multimodal reasoning', 'quantum surface spectroscopy', 'homomorphic encryption genomics']
    };
  }

  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      return {
        user: parsed.user || DEFAULT_USER,
        savedPaperIds: parsed.savedPaperIds || ['paper-101', 'paper-104'],
        papers: parsed.papers || INITIAL_PAPERS,
        researchers: parsed.researchers || INITIAL_RESEARCHERS,
        feedPosts: parsed.feedPosts || INITIAL_FEED_POSTS,
        collections: parsed.collections || INITIAL_COLLECTIONS,
        projects: parsed.projects || INITIAL_PROJECTS,
        notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
        trendingTopics: parsed.trendingTopics || INITIAL_TRENDING_TOPICS,
        manuscripts: parsed.manuscripts || INITIAL_MANUSCRIPTS,
        searchHistory: parsed.searchHistory || ['multimodal reasoning', 'quantum surface spectroscopy']
      };
    }
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
  }

  return {
    user: DEFAULT_USER,
    savedPaperIds: ['paper-101', 'paper-104'],
    papers: INITIAL_PAPERS,
    researchers: INITIAL_RESEARCHERS,
    feedPosts: INITIAL_FEED_POSTS,
    collections: INITIAL_COLLECTIONS,
    projects: INITIAL_PROJECTS,
    notifications: INITIAL_NOTIFICATIONS,
    trendingTopics: INITIAL_TRENDING_TOPICS,
    manuscripts: INITIAL_MANUSCRIPTS,
    searchHistory: ['multimodal reasoning', 'quantum surface spectroscopy']
  };
};

let globalState: PlatformState | null = null;
let isInitializedOnClient = false;
const listeners = new Set<(state: PlatformState) => void>();

function getStoreState(): PlatformState {
  if (typeof window !== 'undefined' && !isInitializedOnClient) {
    isInitializedOnClient = true;
    globalState = getInitialState();
  } else if (!globalState) {
    globalState = getInitialState();
  }
  return globalState;
}

function setStoreState(updater: (prev: PlatformState) => PlatformState) {
  const nextState = updater(getStoreState());
  globalState = nextState;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }
  listeners.forEach((listener) => listener(nextState));
}

export function usePlatformStore() {
  const [state, setState] = useState<PlatformState>(getStoreState);

  useEffect(() => {
    const listener = (newState: PlatformState) => {
      setState(newState);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggleSavePaper = (paperId: string) => {
    setStoreState((prev) => {
      const isSaved = prev.savedPaperIds.includes(paperId);
      const updatedSaved = isSaved
        ? prev.savedPaperIds.filter((id) => id !== paperId)
        : [...prev.savedPaperIds, paperId];
      return { ...prev, savedPaperIds: updatedSaved };
    });
  };

  const toggleFollowResearcher = (researcherId: string) => {
    setStoreState((prev) => {
      const updated = prev.researchers.map((r) => {
        if (r.id === researcherId) {
          const isFollowed = !r.isFollowed;
          return {
            ...r,
            isFollowed,
            followersCount: isFollowed ? r.followersCount + 1 : Math.max(0, r.followersCount - 1)
          };
        }
        return r;
      });
      return { ...prev, researchers: updated };
    });
  };

  const toggleLikePost = (postId: string) => {
    setStoreState((prev) => {
      const updatedPosts = prev.feedPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
          };
        }
        return post;
      });
      return { ...prev, feedPosts: updatedPosts };
    });
  };

  const addCommentToPost = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    setStoreState((prev) => {
      const newComment = {
        id: 'c-' + Date.now(),
        authorName: prev.user.name,
        authorInstitution: prev.user.institution,
        authorAvatar: prev.user.avatar,
        content: commentText.trim(),
        timestamp: 'Just now',
        verified: prev.user.verified
      };
      const updatedPosts = prev.feedPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      });
      return { ...prev, feedPosts: updatedPosts };
    });
  };

  const createPost = (content: string, postType: FeedPost['postType'], linkedPaper?: Paper) => {
    if (!content.trim()) return;
    setStoreState((prev) => {
      const newPost: FeedPost = {
        id: 'post-' + Date.now(),
        authorId: prev.user.id,
        authorName: prev.user.name,
        authorTitle: prev.user.title,
        authorInstitution: prev.user.institution,
        authorAvatar: prev.user.avatar,
        authorVerified: prev.user.verified,
        content: content.trim(),
        postType,
        timestamp: 'Just now',
        likes: 0,
        linkedPaper,
        comments: [],
        tags: [postType, 'Research'],
        isLiked: false
      };
      return { ...prev, feedPosts: [newPost, ...prev.feedPosts] };
    });
  };

  const createCollection = (name: string, description: string) => {
    setStoreState((prev) => {
      const newCol: Collection = {
        id: 'col-' + Date.now(),
        name,
        description,
        pinned: false,
        paperIds: [],
        createdDate: new Date().toISOString().split('T')[0],
        aiSummary: 'Collection created. Add papers to generate AI collection analysis.',
        shareableLink: `https://ai.studio/collections/col-${Date.now()}?share=token`
      };
      return { ...prev, collections: [newCol, ...prev.collections] };
    });
  };

  const togglePinCollection = (collectionId: string) => {
    setStoreState((prev) => {
      const updated = prev.collections.map((c) => (c.id === collectionId ? { ...c, pinned: !c.pinned } : c));
      return { ...prev, collections: updated };
    });
  };

  const addPaperToCollection = (collectionId: string, paperId: string) => {
    setStoreState((prev) => {
      const updated = prev.collections.map((c) => {
        if (c.id === collectionId && !c.paperIds.includes(paperId)) {
          return { ...c, paperIds: [...c.paperIds, paperId] };
        }
        return c;
      });
      return { ...prev, collections: updated };
    });
  };

  const removePaperFromCollection = (collectionId: string, paperId: string) => {
    setStoreState((prev) => {
      const updated = prev.collections.map((c) => {
        if (c.id === collectionId) {
          return { ...c, paperIds: c.paperIds.filter((id) => id !== paperId) };
        }
        return c;
      });
      return { ...prev, collections: updated };
    });
  };

  const deleteCollection = (collectionId: string) => {
    setStoreState((prev) => ({
      ...prev,
      collections: prev.collections.filter((c) => c.id !== collectionId)
    }));
  };

  const createWorkspaceProject = (name: string, description: string, field: string) => {
    setStoreState((prev) => {
      const newProj: WorkspaceProject = {
        id: 'proj-' + Date.now(),
        name,
        description,
        field,
        status: 'Active',
        ownerName: prev.user.name,
        members: [{ name: prev.user.name, role: 'Owner', email: prev.user.email, avatar: prev.user.avatar }],
        paperIds: [],
        notes: [],
        tasks: [],
        milestones: [],
        datasets: [],
        documents: [],
        discussions: [],
        activityHistory: [
          { date: 'Mon', papersAdded: 1, notesCreated: 1, tasksCompleted: 0 }
        ]
      };
      return { ...prev, projects: [newProj, ...prev.projects] };
    });
  };

  const addTaskToProject = (projectId: string, title: string, dueDate: string, assigneeName: string) => {
    setStoreState((prev) => {
      const newTask = {
        id: 't-' + Date.now(),
        title,
        dueDate: dueDate || '2026-08-30',
        assigneeName: assigneeName || prev.user.name,
        assigneeAvatar: prev.user.avatar,
        status: 'Todo' as const
      };
      const updatedProjects = prev.projects.map((p) => {
        if (p.id === projectId) {
          return { ...p, tasks: [...p.tasks, newTask] };
        }
        return p;
      });
      return { ...prev, projects: updatedProjects };
    });
  };

  const updateTaskStatus = (projectId: string, taskId: string, newStatus: Task['status']) => {
    setStoreState((prev) => {
      const updatedProjects = prev.projects.map((p) => {
        if (p.id === projectId) {
          const updatedTasks = p.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
          return { ...p, tasks: updatedTasks };
        }
        return p;
      });
      return { ...prev, projects: updatedProjects };
    });
  };

  const addNoteToProject = (projectId: string, title: string, content: string, paperId?: string) => {
    setStoreState((prev) => {
      const paper = prev.papers.find((p) => p.id === paperId);
      const newNote = {
        id: 'note-' + Date.now(),
        title,
        content,
        paperId,
        paperTitle: paper?.title,
        updatedAt: new Date().toISOString().split('T')[0],
        authorName: prev.user.name
      };
      const updatedProjects = prev.projects.map((p) => {
        if (p.id === projectId) {
          return { ...p, notes: [newNote, ...p.notes] };
        }
        return p;
      });
      return { ...prev, projects: updatedProjects };
    });
  };

  const addProjectDiscussion = (projectId: string, content: string) => {
    if (!content.trim()) return;
    setStoreState((prev) => {
      const newMsg = {
        id: 'disc-' + Date.now(),
        authorName: prev.user.name,
        authorAvatar: prev.user.avatar,
        content: content.trim(),
        timestamp: 'Just now'
      };
      const updatedProjects = prev.projects.map((p) => {
        if (p.id === projectId) {
          return { ...p, discussions: [...p.discussions, newMsg] };
        }
        return p;
      });
      return { ...prev, projects: updatedProjects };
    });
  };

  const inviteCollaborator = (projectId: string, email: string, role: 'Owner' | 'Editor' | 'Viewer') => {
    setStoreState((prev) => {
      const nameFromEmail = email.split('@')[0].replace('.', ' ');
      const newMember = {
        name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        role,
        email,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`
      };
      const updatedProjects = prev.projects.map((p) => {
        if (p.id === projectId) {
          return { ...p, members: [...p.members, newMember] };
        }
        return p;
      });
      return { ...prev, projects: updatedProjects };
    });
  };

  const markNotificationRead = (id: string) => {
    setStoreState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    }));
  };

  const markAllNotificationsRead = () => {
    setStoreState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true }))
    }));
  };

  const toggleVerificationUser = () => {
    setStoreState((prev) => ({
      ...prev,
      user: { ...prev.user, verified: !prev.user.verified }
    }));
  };

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    setStoreState((prev) => ({
      ...prev,
      user: { ...prev.user, ...updatedProfile }
    }));
  };

  const addSearchHistory = (query: string) => {
    if (!query.trim()) return;
    setStoreState((prev) => {
      const filtered = prev.searchHistory.filter((q) => q.toLowerCase() !== query.toLowerCase());
      return { ...prev, searchHistory: [query.trim(), ...filtered].slice(0, 10) };
    });
  };

  const submitManuscript = (manuscript: ManuscriptSubmission) => {
    setStoreState((prev) => ({
      ...prev,
      manuscripts: [manuscript, ...prev.manuscripts]
    }));
  };

  return {
    state,
    user: state.user,
    savedPaperIds: state.savedPaperIds,
    papers: state.papers,
    researchers: state.researchers,
    feedPosts: state.feedPosts,
    collections: state.collections,
    projects: state.projects,
    notifications: state.notifications,
    trendingTopics: state.trendingTopics,
    manuscripts: state.manuscripts,
    searchHistory: state.searchHistory,
    toggleSavePaper,
    toggleFollowResearcher,
    toggleLikePost,
    addCommentToPost,
    createPost,
    createCollection,
    togglePinCollection,
    addPaperToCollection,
    removePaperFromCollection,
    deleteCollection,
    createWorkspaceProject,
    addTaskToProject,
    updateTaskStatus,
    addNoteToProject,
    addProjectDiscussion,
    inviteCollaborator,
    markNotificationRead,
    markAllNotificationsRead,
    toggleVerificationUser,
    updateProfile,
    addSearchHistory,
    submitManuscript
  };
}
