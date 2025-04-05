import React, { useState } from 'react';
import { useAuth } from '@/utils/auth';
import { useQuery } from '@tanstack/react-query';
import { UserActivity } from '@shared/schema';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { 
  Award,
  Camera,
  CloudLightning,
  MessageSquare,
  ShoppingBag,
  User as UserIcon,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: user ? [`/api/users/${user.id}/activities`] : [],
    enabled: !!user,
  });
  
  // Calculate points to next level
  const getCurrentLevel = (score: number): { level: number; title: string } => {
    if (score < 100) return { level: 1, title: 'Eco Beginner' };
    if (score < 250) return { level: 2, title: 'Eco Enthusiast' };
    if (score < 500) return { level: 3, title: 'Eco Advocate' };
    if (score < 1000) return { level: 4, title: 'Eco Warrior' };
    return { level: 5, title: 'Eco Champion' };
  };
  
  const getNextLevelPoints = (currentScore: number): { required: number; remaining: number; progress: number } => {
    const levelThresholds = [0, 100, 250, 500, 1000, 2000];
    let currentLevel = 0;
    
    for (let i = 0; i < levelThresholds.length; i++) {
      if (currentScore < levelThresholds[i]) {
        currentLevel = i - 1;
        break;
      }
    }
    
    if (currentLevel >= levelThresholds.length - 2) {
      currentLevel = levelThresholds.length - 2;
    }
    
    const currentThreshold = levelThresholds[currentLevel];
    const nextThreshold = levelThresholds[currentLevel + 1];
    const pointsRequired = nextThreshold - currentThreshold;
    const pointsAchieved = currentScore - currentThreshold;
    const pointsRemaining = nextThreshold - currentScore;
    const progressPercentage = (pointsAchieved / pointsRequired) * 100;
    
    return {
      required: pointsRequired,
      remaining: pointsRemaining,
      progress: progressPercentage
    };
  };
  
  const handleRedeemReward = (points: number, rewardName: string) => {
    if (!user) return;
    
    if (user.ecoScore < points) {
      toast({
        title: "Not enough points",
        description: `You need ${points - user.ecoScore} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Reward redeemed",
      description: `You have successfully redeemed: ${rewardName}`,
    });
  };
  
  // Group activities by type for points breakdown
  const getPointsBreakdown = () => {
    if (!activities) return [];
    
    const breakdown: { type: string; points: number; icon: React.ReactNode }[] = [];
    const pointsByType: Record<string, number> = {};
    
    activities.forEach((activity: UserActivity) => {
      const type = activity.activityType;
      pointsByType[type] = (pointsByType[type] || 0) + activity.pointsEarned;
    });
    
    if (pointsByType['waste_recognition']) {
      breakdown.push({
        type: 'Waste Recognition',
        points: pointsByType['waste_recognition'],
        icon: <Camera className="h-5 w-5 text-primary-500" />
      });
    }
    
    if (pointsByType['emissions_calculation']) {
      breakdown.push({
        type: 'CO₂ Calculations',
        points: pointsByType['emissions_calculation'],
        icon: <CloudLightning className="h-5 w-5 text-primary-500" />
      });
    }
    
    if (pointsByType['forum_post'] || pointsByType['forum_comment']) {
      breakdown.push({
        type: 'Forum Participation',
        points: (pointsByType['forum_post'] || 0) + (pointsByType['forum_comment'] || 0),
        icon: <MessageSquare className="h-5 w-5 text-primary-500" />
      });
    }
    
    return breakdown;
  };
  
  if (!user) return null;
  
  const currentLevel = getCurrentLevel(user.ecoScore);
  const nextLevel = getNextLevelPoints(user.ecoScore);
  const pointsBreakdown = getPointsBreakdown();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="pb-5 border-b border-neutral-200">
          <h3 className="text-lg leading-6 font-medium text-neutral-900 font-heading">My Profile</h3>
          <p className="mt-2 max-w-4xl text-sm text-neutral-500">Manage your account and view your eco-impact</p>
        </div>
        
        <div className="mt-6">
          <Card className="shadow">
            <CardHeader className="px-6 py-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Personal details and preferences</CardDescription>
              </div>
              <div className="h-16 w-16 rounded-full bg-primary-200 flex items-center justify-center">
                <span className="text-xl text-primary-800 font-medium">
                  {user.fullName 
                    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() 
                    : user.username.substring(0, 2).toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <dl>
                <div className="bg-neutral-50 px-6 py-5 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-neutral-500">Full name</dt>
                  <dd className="text-sm text-neutral-900 col-span-2">{user.fullName || 'Not specified'}</dd>
                </div>
                <div className="bg-white px-6 py-5 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-neutral-500">Email address</dt>
                  <dd className="text-sm text-neutral-900 col-span-2">{user.email}</dd>
                </div>
                <div className="bg-neutral-50 px-6 py-5 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-neutral-500">Location</dt>
                  <dd className="text-sm text-neutral-900 col-span-2">{user.location || 'Not specified'}</dd>
                </div>
                <div className="bg-white px-6 py-5 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-neutral-500">Member since</dt>
                  <dd className="text-sm text-neutral-900 col-span-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-neutral-900 font-heading">Eco Score</h3>
            
            <Card className="mt-4 shadow">
              <CardContent className="p-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-neutral-900">{user.ecoScore} points</h4>
                    <p className="mt-1 text-sm text-neutral-500">Level {currentLevel.level}: {currentLevel.title}</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      Top 15% of users
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div>
                    <h5 className="text-sm font-medium text-neutral-500">Progress to next level</h5>
                    <div className="mt-2 relative">
                      <Progress value={nextLevel.progress} className="h-2" />
                      <div className="text-xs text-neutral-500 mt-1">
                        {nextLevel.remaining} points to Level {currentLevel.level + 1}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Card className="shadow">
                <CardContent className="p-6">
                  <h4 className="text-base font-medium text-neutral-900">Points Breakdown</h4>
                  
                  {isLoadingActivities ? (
                    <div className="mt-4 flex justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : pointsBreakdown.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {pointsBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            {item.icon}
                            <span className="ml-2 text-sm text-neutral-700">{item.type}</span>
                          </div>
                          <span className="text-sm font-medium text-neutral-900">{item.points} points</span>
                        </div>
                      ))}
                      
                      {/* Add others category if there are any not categorized activities */}
                      {activities && activities.some((a: UserActivity) => 
                        !['waste_recognition', 'emissions_calculation', 'forum_post', 'forum_comment'].includes(a.activityType)
                      ) && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ShoppingBag className="h-5 w-5 text-primary-500" />
                            <span className="ml-2 text-sm text-neutral-700">Other Activities</span>
                          </div>
                          <span className="text-sm font-medium text-neutral-900">
                            {activities
                              .filter((a: UserActivity) => !['waste_recognition', 'emissions_calculation', 'forum_post', 'forum_comment'].includes(a.activityType))
                              .reduce((sum: number, a: UserActivity) => sum + a.pointsEarned, 0)} points
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 text-center py-6">
                      <p className="text-neutral-500">No activities yet. Start using the app to earn points!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="shadow">
                <CardContent className="p-6">
                  <h4 className="text-base font-medium text-neutral-900">Rewards Available</h4>
                  
                  <div className="mt-4 space-y-4">
                    <div className="border border-neutral-200 rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-neutral-900">$5 Discount Coupon</h5>
                          <p className="text-xs text-neutral-500 mt-1">Use on any purchase in our marketplace</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary-700 bg-primary-100 hover:bg-primary-200 hover:text-primary-800"
                          onClick={() => handleRedeemReward(100, "$5 Discount Coupon")}
                        >
                          Redeem for 100 points
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-neutral-200 rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-neutral-900">Plant a Tree</h5>
                          <p className="text-xs text-neutral-500 mt-1">We'll plant a tree on your behalf</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary-700 bg-primary-100 hover:bg-primary-200 hover:text-primary-800"
                          onClick={() => handleRedeemReward(200, "Plant a Tree")}
                        >
                          Redeem for 200 points
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-neutral-200 rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-neutral-900">Premium Features</h5>
                          <p className="text-xs text-neutral-500 mt-1">1 month access to all premium features</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary-700 bg-primary-100 hover:bg-primary-200 hover:text-primary-800"
                          onClick={() => handleRedeemReward(350, "Premium Features")}
                        >
                          Redeem for 350 points
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
