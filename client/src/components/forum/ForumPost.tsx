import React from 'react';
import { ForumPost as ForumPostType } from '@shared/schema';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ForumPostProps {
  post: ForumPostType;
  onLike?: () => void;
}

const ForumPost: React.FC<ForumPostProps> = ({ post, onLike }) => {
  const { toast } = useToast();
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const postDate = new Date(date);
    
    // If less than 7 days, show relative time
    if (now.getTime() - postDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(postDate, { addSuffix: true });
    }
    
    // Otherwise show full date
    return format(postDate, 'MMM d, yyyy');
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'recycling':
        return 'Recycling';
      case 'climate_change':
        return 'Climate Change';
      case 'sustainability':
        return 'Sustainability';
      case 'events':
        return 'Events';
      case 'questions':
        return 'Questions';
      case 'general':
        return 'General';
      default:
        return category;
    }
  };
  
  const handleLike = async () => {
    try {
      await apiRequest('POST', `/api/forum/posts/${post.id}/like`, {});
      if (onLike) onLike();
      toast({
        title: "Post liked",
        description: "You liked this post",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like the post",
        variant: "destructive",
      });
    }
  };

  // Generate user initials from user ID
  // In a real app, we would fetch the user's name
  const getUserInitials = (userId: number) => {
    const hash = userId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return `${characters[hash % 26]}${characters[(hash + 5) % 26]}`;
  };

  return (
    <div className="mt-4 bg-white overflow-hidden shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary-200 flex items-center justify-center">
                <span className="text-primary-800 font-medium">{getUserInitials(post.userId)}</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <h5 className="text-base font-medium text-neutral-900">
                <Link href={`/forums/post/${post.id}`} className="hover:underline">
                  {post.title}
                </Link>
              </h5>
              <div className="mt-1 flex items-center text-sm text-neutral-500">
                <span>Posted by: User {post.userId}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(new Date(post.createdAt))}</span>
                <span className="mx-2">•</span>
                <span>{getCategoryLabel(post.category)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="flex items-center text-sm text-neutral-500">
              <MessageSquare className="h-5 w-5 mr-1 text-neutral-400" />
              {post.commentCount} comments
            </div>
            <button 
              onClick={handleLike}
              className="flex items-center text-sm text-neutral-500 hover:text-primary-600"
            >
              <ThumbsUp className="h-5 w-5 mr-1 text-neutral-400" />
              {post.likes}
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-neutral-700">
          <p>{post.content}</p>
        </div>
        
        <div className="mt-4">
          <Link 
            href={`/forums/post/${post.id}`} 
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
