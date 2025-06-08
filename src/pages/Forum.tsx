import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, MessageCircle, Send, Clock, Eye } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface ForumMessage {
  id: number;
  author: string;
  role: 'parent' | 'teacher' | 'admin';
  title: string;
  content: string;
  timestamp: Date;
  replies: number;
  views: number;
  isPrivate?: boolean;
}

const Forum: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('parents');
  const [newMessage, setNewMessage] = useState({ title: '', content: '' });
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);

  const mockMessages: ForumMessage[] = [
    {
      id: 1,
      author: 'Marie Koumba',
      role: 'parent',
      title: 'Question sur les horaires de cantine',
      content: 'Bonjour, je voulais savoir s\'il était possible de modifier les horaires de cantine pour mon enfant...',
      timestamp: new Date(2024, 5, 7, 14, 30),
      replies: 3,
      views: 15
    },
    {
      id: 2,
      author: 'Jean Moussa',
      role: 'teacher',
      title: 'Réunion parents-professeurs',
      content: 'La prochaine réunion parents-professeurs aura lieu le 15 juin. Merci de confirmer votre présence...',
      timestamp: new Date(2024, 5, 6, 16, 45),
      replies: 8,
      views: 42
    },
    {
      id: 3,
      author: 'Administration',
      role: 'admin',
      title: 'Nouvelles mesures sanitaires',
      content: 'Suite aux recommandations du ministère, voici les nouvelles mesures sanitaires à appliquer...',
      timestamp: new Date(2024, 5, 5, 9, 0),
      replies: 12,
      views: 156
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'parent': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'parent': return 'Parent';
      case 'teacher': return 'Enseignant';
      case 'admin': return 'Administration';
      default: return 'Utilisateur';
    }
  };

  const filterMessagesByRole = (role: string) => {
    if (role === 'all') return mockMessages;
    return mockMessages.filter(msg => msg.role === role);
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.title.trim() || !newMessage.content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message publié",
      description: "Votre message a été publié avec succès.",
    });

    setNewMessage({ title: '', content: '' });
    setShowNewMessageForm(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-myschool-purple-dark text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Forum Communautaire
              </h1>
              <p className="text-lg text-myschool-gray-light max-w-2xl mx-auto">
                Échangez avec les autres membres de la communauté scolaire
              </p>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Discussions</h2>
              <Button onClick={() => setShowNewMessageForm(!showNewMessageForm)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Nouveau message
              </Button>
            </div>

            {showNewMessageForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Nouveau message</CardTitle>
                  <CardDescription>
                    Partagez votre question ou annonce avec la communauté
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitMessage} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Titre du message"
                        value={newMessage.title}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Contenu de votre message..."
                        rows={4}
                        value={newMessage.content}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Send className="h-4 w-4 mr-2" />
                        Publier
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowNewMessageForm(false)}>
                        Annuler
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="parents">Forum Parents</TabsTrigger>
                <TabsTrigger value="teachers">Forum Enseignants</TabsTrigger>
                <TabsTrigger value="admin">Annonces Admin</TabsTrigger>
                <TabsTrigger value="private">Messages Privés</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {mockMessages.map((message) => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getRoleColor(message.role)}>
                            {getRoleLabel(message.role)}
                          </Badge>
                          <span className="font-medium">{message.author}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {message.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {message.replies}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{message.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{message.content}</p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Lire la suite
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="parents" className="space-y-4">
                {filterMessagesByRole('parent').map((message) => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getRoleColor(message.role)}>
                            {getRoleLabel(message.role)}
                          </Badge>
                          <span className="font-medium">{message.author}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {message.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {message.replies}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{message.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{message.content}</p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Lire la suite
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="teachers" className="space-y-4">
                {filterMessagesByRole('teacher').map((message) => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getRoleColor(message.role)}>
                            {getRoleLabel(message.role)}
                          </Badge>
                          <span className="font-medium">{message.author}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {message.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {message.replies}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{message.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{message.content}</p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Lire la suite
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                {filterMessagesByRole('admin').map((message) => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getRoleColor(message.role)}>
                            {getRoleLabel(message.role)}
                          </Badge>
                          <span className="font-medium">{message.author}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {message.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {message.replies}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{message.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{message.content}</p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Lire la suite
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="private">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Messages Privés</h3>
                    <p className="text-gray-600 mb-4">
                      Fonctionnalité de messagerie privée à venir
                    </p>
                    <Button disabled>Bientôt disponible</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Forum;
