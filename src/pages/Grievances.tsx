import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import toast from 'react-hot-toast';

interface Grievance {
  id: string;
  title: string;
  description: string;
  department: string;
  status: string;
  created_at: string;
}

const Grievances: React.FC = () => {
  const { t } = useLanguage();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const { data, error } = await supabase
        .from('grievances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGrievances(data || []);
    } catch (error) {
      toast.error(t({ en: 'Failed to fetch grievances', hi: 'शिकायतें लाने में विफल' }));
    } finally {
      setLoading(false);
    }
  };

  const handleNewGrievance = async () => {
    try {
      const { error } = await supabase
        .from('grievances')
        .insert([
          {
            title: 'Test Grievance',
            description: 'Test Description',
            department: 'general'
          }
        ]);

      if (error) throw error;
      toast.success(t({ en: 'Grievance submitted successfully', hi: 'शिकायत सफलतापूर्वक दर्ज की गई' }));
      fetchGrievances();
    } catch (error) {
      toast.error(t({ en: 'Failed to submit grievance', hi: 'शिकायत दर्ज करने में विफल' }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {t({ en: 'Grievances', hi: 'शिकायतें' })}
        </h1>
        <Button onClick={handleNewGrievance}>
          {t({ en: 'New Grievance', hi: 'नई शिकायत' })}
        </Button>
      </div>

      <div className="grid gap-4">
        {grievances.map((grievance) => (
          <Card key={grievance.id}>
            <CardContent>
              <h3 className="font-semibold mb-2">{grievance.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{grievance.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(grievance.created_at).toLocaleDateString()}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  grievance.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  grievance.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {grievance.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Grievances;