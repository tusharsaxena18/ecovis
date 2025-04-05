import React, { useState } from 'react';
import { useAuth } from '@/utils/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ForumPost as ForumPostType } from '@shared/schema';
import ForumPost from '@/components/forum/ForumPost';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MessageSquare, Plus } from 'lucide-react';

const ForumsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/forum/posts', page, postsPerPage],
    queryFn: async () => {
      const response = await fetch(`/api/forum/posts?limit=${postsPerPage}&offset=${(page - 1) * postsPerPage}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
  });
  
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await apiRequest('POST', '/api/forum/posts', postData);
    },
    onSuccess: () => {
      // Reset form
      setNewPost({
        title: '',
        content: '',
        category: 'general'
      });
      
      // Close dialog
      setDialogOpen(false);
      
      // Show success message
      toast({
        title: "Post created",
        description: "Your post has been created successfully",
      });
      
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to create post",
        description: "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleCreatePost = () => {
    if (!user) return;
    
    // Validate inputs
    if (!newPost.title || !newPost.content) {
      toast({
        title: "Missing information",
        description: "Please provide a title and content for your post",
        variant: "destructive",
      });
      return;
    }
    
    createPostMutation.mutate({
      userId: user.id,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
    });
  };
  
  const handlePostLike = () => {
    // Refetch posts after like
    queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
  };
  
  // Calculate total pages
  const totalPages = posts ? Math.ceil(posts.length / postsPerPage) : 0;
  
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center justify-between pb-5 border-b border-neutral-200">
          <div>
            <h3 className="text-lg leading-6 font-medium text-neutral-900 font-heading">Global Discussion Forum</h3>
            <p className="mt-2 max-w-4xl text-sm text-neutral-500">Connect with fellow environmentalists worldwide</p>
          </div>
          <div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create a New Post</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="post-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="post-title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter a descriptive title"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="post-category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={newPost.category}
                      onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                    >
                      <SelectTrigger id="post-category" className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recycling">Recycling</SelectItem>
                        <SelectItem value="climate_change">Climate Change</SelectItem>
                        <SelectItem value="sustainability">Sustainability</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="questions">Questions</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="post-content" className="text-right">
                      Content
                    </Label>
                    <Textarea
                      id="post-content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="col-span-3"
                      placeholder="Share your thoughts, ideas, or questions..."
                      rows={6}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreatePost} disabled={createPostMutation.isPending}>
                    {createPostMutation.isPending ? <LoadingSpinner size="small" /> : 'Post'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="py-10 text-center">
              <LoadingSpinner />
              <p className="mt-4 text-neutral-500">Loading forum posts...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              {posts.map((post: ForumPostType) => (
                <ForumPost key={post.id} post={post} onLike={handlePostLike} />
              ))}
              
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          className="cursor-pointer"
                          aria-disabled={page === 1}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Logic to show current page and adjacent pages
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        // Only show if pageNum is valid
                        if (pageNum > 0 && pageNum <= totalPages) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                isActive={page === pageNum}
                                onClick={() => setPage(pageNum)}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          className="cursor-pointer"
                          aria-disabled={page === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <MessageSquare className="h-12 w-12 text-neutral-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-neutral-900">No discussions yet</h3>
              <p className="mt-2 text-neutral-500">Be the first to start a discussion about sustainability!</p>
              <Button 
                className="mt-4" 
                onClick={() => setDialogOpen(true)}
              >
                Start a Discussion
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumsPage;
