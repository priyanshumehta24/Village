import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import toast from 'react-hot-toast';

interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
  availability: boolean;
}

const Resources: React.FC = () => {
  const { t } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*');

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      toast.error(t({ en: 'Failed to fetch resources', hi: 'संसाधन लाने में विफल' }));
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            resource_id: resourceId,
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 3600000).toISOString()
          }
        ]);

      if (error) throw error;
      toast.success(t({ en: 'Booking request submitted', hi: 'बुकिंग अनुरोध जमा किया गया' }));
    } catch (error) {
      toast.error(t({ en: 'Failed to submit booking', hi: 'बुकिंग जमा करने में विफल' }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t({ en: 'Available Resources', hi: 'उपलब्ध संसाधन' })}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <CardContent>
              <h3 className="font-semibold mb-2">{resource.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  resource.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {resource.availability ? 
                    t({ en: 'Available', hi: 'उपलब्ध' }) : 
                    t({ en: 'Not Available', hi: 'उपलब्ध नहीं' })
                  }
                </span>
                <Button
                  onClick={() => handleBooking(resource.id)}
                  disabled={!resource.availability}
                >
                  {t({ en: 'Book Now', hi: 'अभी बुक करें' })}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Resources;