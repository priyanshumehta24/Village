import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Card, { CardContent } from '../components/ui/Card';
import { FileText, Calendar, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const menuItems = [
    {
      id: 'applications',
      icon: FileText,
      title: { en: 'Applications', hi: 'आवेदन' },
      description: { 
        en: 'Submit and track your applications',
        hi: 'अपने आवेदन जमा करें और ट्रैक करें'
      }
    },
    {
      id: 'resources',
      icon: Calendar,
      title: { en: 'Resources', hi: 'संसाधन' },
      description: {
        en: 'Book community spaces and equipment',
        hi: 'सामुदायिक स्थान और उपकरण बुक करें'
      }
    },
    {
      id: 'grievances',
      icon: AlertCircle,
      title: { en: 'Grievances', hi: 'शिकायतें' },
      description: {
        en: 'Submit and track complaints',
        hi: 'शिकायतें दर्ज करें और ट्रैक करें'
      }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t({ en: 'Welcome', hi: 'स्वागत है' })}, {user?.email}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} to={`/${item.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <Icon className="w-12 h-12 text-green-700 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">{t(item.title)}</h2>
                  <p className="text-gray-600">{t(item.description)}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;