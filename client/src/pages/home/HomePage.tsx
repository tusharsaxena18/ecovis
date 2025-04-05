import React, { useEffect, useState } from 'react';
import { useAuth } from '@/utils/auth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Award, 
  Camera, 
  ChevronRight, 
  CloudLightning, 
  MessageSquare 
} from 'lucide-react';
import { UserActivity } from '@shared/schema';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: user ? [`/api/users/${user.id}/activities`] : [],
    enabled: !!user,
  });
  
  if (!user) return null;

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'waste_recognition':
        return <Camera className="h-8 w-8 text-primary-500" />;
      case 'emissions_calculation':
        return <CloudLightning className="h-8 w-8 text-primary-500" />;
      case 'forum_post':
      case 'forum_comment':
        return <MessageSquare className="h-8 w-8 text-primary-500" />;
      default:
        return <Award className="h-8 w-8 text-primary-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getActivityDescription = (activity: UserActivity) => {
    return activity.description;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="pb-5 border-b border-neutral-200">
          <h3 className="text-lg leading-6 font-medium text-neutral-900 font-heading">Dashboard</h3>
          <p className="mt-2 max-w-4xl text-sm text-neutral-500">Track your environmental impact and contributions</p>
        </div>
        
        <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Eco Score Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-neutral-500 truncate">Eco Score</dt>
                  <dd>
                    <div className="flex items-center">
                      <div className="text-2xl font-semibold text-neutral-900">{user.ecoScore}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Increased by</span>
                        15%
                      </div>
                    </div>
                  </dd>
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/profile" className="font-medium text-primary-600 hover:text-primary-500">
                  View all activities
                  <span className="sr-only"> stats</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Waste Recognized Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <Camera className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-neutral-500 truncate">Waste Recognized</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-neutral-900">
                      {activities?.filter(a => a.activityType === 'waste_recognition').length || 0}
                    </div>
                    <div className="text-sm text-neutral-500">items this month</div>
                  </dd>
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/waste-recognition" className="font-medium text-primary-600 hover:text-primary-500">
                  Analyze waste patterns
                  <span className="sr-only"> stats</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* CO2 Saved Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <CloudLightning className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-neutral-500 truncate">CO₂ Emissions Saved</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-neutral-900">142 kg</div>
                    <div className="text-sm text-neutral-500">this year</div>
                  </dd>
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/emissions" className="font-medium text-primary-600 hover:text-primary-500">
                  See your impact
                  <span className="sr-only"> stats</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg leading-6 font-medium text-neutral-900 font-heading">Recent Activity</h3>
          <div className="mt-4 bg-white shadow rounded-lg overflow-hidden">
            {isLoadingActivities ? (
              <div className="p-6">
                <LoadingSpinner />
              </div>
            ) : activities && activities.length > 0 ? (
              <ul role="list" className="divide-y divide-neutral-200">
                {activities.map((activity) => (
                  <li key={activity.id} className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {getActivityIcon(activity.activityType)}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {getActivityDescription(activity)}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {formatDate(activity.createdAt.toString())}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          +{activity.pointsEarned} points
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <p className="text-neutral-500">No recent activities yet</p>
                <p className="mt-2 text-sm text-neutral-400">Start using the app to track your eco-friendly actions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
