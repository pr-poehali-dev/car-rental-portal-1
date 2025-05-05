
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Loader2,
  Plus,
  UserCog,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import api, { User as UserType } from "@/lib/api";
import UserForm from "@/components/admin/UserForm";

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Имитация загрузки данных с API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // В реальном приложении:
        // const response = await api.users.getAll(currentPage, itemsPerPage);
        // setUsers(response.data);
        // setTotalPages(response.totalPages);
        
        // Имитация для демонстрации
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUsers: UserType[] = [
          {
            id: "1",
            email: "admin@autopro.ru",
            firstName: "Администратор",
            lastName: "Системы",
            phone: "+7 (999) 123-45-67",
            role: "admin",
            createdAt: "2023-01-01T10:00:00Z",
            updatedAt: "2023-01-01T10:00:00Z"
          },
          {
            id: "2",
            email: "ivan@example.com",
            firstName: "Иван",
            lastName: "Петров",
            phone: "+7 (999) 234-56-78",
            role: "user",
            createdAt: "2023-02-15T14:30:00Z",
            updatedAt: "2023-02-15T14:30:00Z"
          },
          {
            id: "3",
            email: "elena@example.com",
            firstName: "Елена",
            lastName: "Сидорова",
            phone: "+7 (999) 345-67-89",
            role: "user",
            createdAt: "2023-03-10T09:15:00Z",
            updatedAt: "2023-03-10T09:15:00Z"
          },
          {
            id: "4",
            email: "alexey@example.com",
            firstName: "Алексей",
            lastName: "Иванов",
            phone: "+7 (999) 456-78-90",
            role: "user",
            createdAt: "2023-04-05T16:45:00Z",
            updatedAt: "2023-04-05T16:45:00Z"
          },
          {
            id: "5",
            email: "maria@example.com",
            firstName: "Мария",
            lastName: "Кузнецова",
            phone: "+7 (999) 567-89-01",
            role: "user",
            createdAt: "2023-05-20T11:30:00Z",
            updatedAt: "2023-05-20T11:30:00Z"
          }
        ];
        
        setUsers(mockUsers);
        setTotalPages(1); // В реальном приложении здесь будет количество страниц
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить список пользователей",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy HH:mm");
    } catch (e) {
      return "Некорректная дата";
    }
  };

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    setIsEditing(true);
    setUserFormOpen(true);
  };

  const handleDelete = (user: UserType) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setUserFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      // В реальном приложении:
      // await api.users.delete(selectedUser.id);
      
      // Имитация для демонстрации
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      toast({
        title: "Успешно",
        description: "Пользователь успешно удален",
      });
      
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
      });
    }
  };

  const handleSaveUser = async (userData: Partial<UserType>) => {
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing && selectedUser) {
        // Редактирование существующего пользователя
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id ? { ...user, ...userData, updatedAt: new Date().toISOString() } : user
        );
        setUsers(updatedUsers);
        
        toast({
          title: "Успешно",
          description: "Данные пользователя обновлены",
        });
      } else {
        // Добавление нового пользователя
        const newUser: UserType = {
          id: `user-${Date.now()}`,
          email: userData.email || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || "",
          role: userData.role || "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setUsers([...users, newUser]);
        
        toast({
          title: "Успешно",
          description: "Новый пользователь добавлен",
        });
      }
      
      setUserFormOpen(false);
    } catch (error) {
      console.error("Ошибка при сохранении пользователя:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить данные пользователя",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.phone.includes(searchTerm)
    );
  });

  return (
    <AdminLayout title="Управление пользователями">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск пользователей..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить пользователя
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Пользователи не найдены</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? "Попробуйте изменить параметры поиска" : "Начните с добавления нового пользователя"}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.role === "admin" ? (
                      <Badge className="bg-blue-500">Администратор</Badge>
                    ) : (
                      <Badge variant="outline">Пользователь</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Редактировать
                        </DropdownMenuItem>
                        {user.role !== "admin" && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Предыдущая
            </Button>
            <div className="flex items-center">
              <span className="text-sm">
                Страница {currentPage} из {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Следующая
            </Button>
          </div>
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Вы действительно хотите удалить пользователя {selectedUser?.firstName} {selectedUser?.lastName}?</p>
            <p className="text-sm text-gray-500 mt-2">Это действие нельзя будет отменить.</p>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Форма добавления/редактирования пользователя */}
      <Dialog open={userFormOpen} onOpenChange={setUserFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Редактирование пользователя" : "Добавление пользователя"}
            </DialogTitle>
          </DialogHeader>
          <UserForm 
            user={selectedUser} 
            onSave={handleSaveUser} 
            onCancel={() => setUserFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
