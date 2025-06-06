
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users as UsersIcon, UserPlus, Edit, Trash2, Shield, User } from 'lucide-react';

interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'staff' | 'tuteur' | 'eleve';
  is_active: boolean;
  created_at: string;
}

const mockUsers: User[] = [
  { id: 1, email: 'alice@example.com', nom: 'Dupont', prenom: 'Alice', role: 'staff', is_active: true, created_at: '2024-01-15' },
  { id: 2, email: 'eric@example.com', nom: 'Nguema', prenom: 'Eric', role: 'eleve', is_active: true, created_at: '2024-02-20' },
  { id: 3, email: 'emilie@example.com', nom: 'Nguema', prenom: 'Emilie', role: 'tuteur', is_active: true, created_at: '2024-01-10' },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    role: 'eleve' as 'staff' | 'tuteur' | 'eleve',
    password: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.prenom} ${user.nom} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Mise à jour
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, id: user.id, created_at: user.created_at, is_active: user.is_active }
          : user
      ));
      toast({
        title: "Utilisateur modifié",
        description: "Les informations ont été mises à jour avec succès",
      });
    } else {
      // Création
      const newUser: User = {
        id: Date.now(),
        ...formData,
        is_active: true,
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      toast({
        title: "Utilisateur créé",
        description: "Le nouvel utilisateur a été ajouté avec succès",
      });
    }

    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({ email: '', nom: '', prenom: '', role: 'eleve', password: '' });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      password: ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès",
    });
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, is_active: !user.is_active } : user
    ));
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      staff: 'destructive',
      tuteur: 'default',
      eleve: 'secondary'
    };
    
    const labels: Record<string, string> = {
      staff: 'Staff',
      tuteur: 'Tuteur',
      eleve: 'Élève'
    };

    return <Badge variant={variants[role] || 'default'}>{labels[role] || role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <UsersIcon className="h-6 w-6" />
            Gestion des utilisateurs
          </h2>
          <p className="text-muted-foreground">Gérez les comptes utilisateurs et leurs permissions</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingUser(null);
              setFormData({ email: '', nom: '', prenom: '', role: 'eleve', password: '' });
            }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Modifiez les informations de l\'utilisateur' : 'Créez un nouveau compte utilisateur'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={formData.role} onValueChange={(value: any) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eleve">Élève</SelectItem>
                      <SelectItem value="tuteur">Tuteur</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!editingUser && (
                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required={!editingUser}
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingUser ? 'Modifier' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Recherchez et filtrez les utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, prénom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="tuteur">Tuteurs</SelectItem>
                <SelectItem value="eleve">Élèves</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>{filteredUsers.length} utilisateur(s) trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.prenom} {user.nom}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      <Badge variant={user.is_active ? 'default' : 'secondary'}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell>{user.created_at}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
