import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import toast from 'react-hot-toast';

interface Application {
  id: string;
  type: string;
  status: string;
  submitted_at: string;
}

const Applications: React.FC = () => {
  const { t } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      toast.error(t({ en: 'Failed to fetch applications', hi: 'आवेदन लाने में विफल' }));
    } finally {
      setLoading(false);
    }
  };

  const handleNewApplication = async () => {
    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            type: 'certificate',
            data: { purpose: 'residence' }
          }
        ]);

      if (error) throw error;
      toast.success(t({ en: 'Application submitted successfully', hi: 'आवेदन सफलतापूर्वक जमा किया गया' }));
      fetchApplications();
    } catch (error) {
      toast.error(t({ en: 'Failed to submit application', hi: 'आवेदन जमा करने में विफल' }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {t({ en: 'Applications', hi: 'आवेदन' })}
        </h1>
        <Button onClick={handleNewApplication}>
          {t({ en: 'New Application', hi: 'नया आवेदन' })}
        </Button>
      </div>

      <div className="grid gap-4">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardContent className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{application.type}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(application.submitted_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                application.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                application.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {application.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Applications;