
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Camera, Save } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState({
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@example.com',
    tel: '+241 06 12 34 56',
    bio: 'Enseignant passionné avec 10 ans d\'expérience'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Photo de profil</CardTitle>
          <CardDescription>Votre photo sera visible par les autres utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Changer la photo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Gérez vos informations de profil</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={profile.prenom}
                  onChange={(e) => setProfile({...profile, prenom: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={profile.nom}
                  onChange={(e) => setProfile({...profile, nom: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="tel">Téléphone</Label>
              <Input
                id="tel"
                value={profile.tel}
                onChange={(e) => setProfile({...profile, tel: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                placeholder="Parlez-nous de vous..."
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              />
            </div>

            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
