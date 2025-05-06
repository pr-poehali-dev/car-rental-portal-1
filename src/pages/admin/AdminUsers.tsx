import { useState, useEffect, useMemo } from "react";
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
  Download,
  FilterX,
  SlidersHorizontal,
  ArrowUpDown,
  Eye
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import api, { User as UserType } from "@/lib/api";
import UserForm from "@/components/admin/UserForm";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortingPanel, SortingOption } from "@/components/ui/sorting-panel";
import { useFilterStorage } from "@/hooks/useFilterStorage";

// Тип фильтров для пользователей
interface UserFilters {
  role: string[];
  dateRange: string[];
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  showArchived: boolean;
  perPage: number;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserType[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  // Опции сортировки
  const sortingOptions: SortingOption[] = [
    { id: 'created_asc', label: 'Дата регистрации (старые)', direction: 'asc', field: 'createdAt' },
    { id: 'created_desc', label: 'Дата регистрации (новые)', direction: 'desc', field: 'createdAt' },
    { id: 'name_asc', label: 'По имени (А-Я)', direction: 'asc', field: 'name' },
    { id: 'name_desc', label: 'По имени (Я-А)', direction: 'desc', field: 'name' }
  ];

  // Фильтры и настройки
  const [filters, setFilters, resetFilters] = useFilterStorage<UserFilters>('admin-users-filters', {
    role: [],
    dateRange: [],
    search: "",
    sortBy: "created_desc",
    sortOrder: "desc",
    showArchived: false,
    perPage: 10
  });

  // Статистика пользователей
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    regular: 0,
    newToday: 0,
    newThisWeek: 0,
    active: 0
  });

  // Имитация загрузки данных с API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // В реальном приложении:
        // const response = await api.users.getAll({
        //   page: currentPage,
        //   limit: filters.perPage,
        //   search: filters.search,
        //   role: filters.role.length ? filters.role : undefined,
        //   sortBy: filters.sortBy.split('_')[0],
        //   sortOrder: filters.sortBy.split('_')[1],
        //   includeArchived: filters.showArchived,
        //   dateFrom: filters.dateRange[0],
        //   dateTo: filters.dateRange[1]
        // });
        // setUsers(response.data);
        // setTotalPages(response.totalPages);
        
        // Имитация для демонстрации
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
          }];
        
        // Фильтрация и сортировка на стороне клиента (в реальном приложении это делалось бы на сервере)
        let filteredUsers = [...mockUsers];
        
        // Фильтр по поиску
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.phone.includes(filters.search)
          );
        }
        
        // Фильтр по роли
        if (filters.role.length > 0) {
          filteredUsers = filteredUsers.filter(user => 
            filters.role.includes(user.role)
          );
        }
        
        // Сортировка
        const [sortField, sortDirection] = filters.sortBy.split('_');
        filteredUsers.sort((a, b) => {
          if (sortField === 'name') {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return sortDirection === 'asc' 
              ? nameA.localeCompare(nameB) 
              : nameB.localeCompare(nameA);
          } else if (sortField === 'created') {
            return sortDirection === 'asc' 
              ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
        
        // Рассчитываем статистику
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - 7);
        
        const stats = {
          total: mockUsers.length,
          admins: mockUsers.filter(u => u.role === 'admin').length,
          regular: mockUsers.filter(u => u.role === 'user').length,
          newToday: mockUsers.filter(u => new Date(u.createdAt) >= todayStart).length,
          newThisWeek: mockUsers.filter(u => new Date(u.createdAt) >= weekStart).length,
          active: Math.floor(mockUsers.length * 0.75) // Имитация активных пользователей
        };
        
        setStats(stats);
        
        // Пагинация на стороне клиента
        const startIndex = (currentPage - 1) * filters.perPage;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + filters.perPage);
        
        setUsers(paginatedUsers);
        setTotalPages(Math.ceil(filteredUsers.length / filters.perPage));
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
  }, [currentPage, filters]);

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
  
  const handleViewDetails = (user: UserType) => {
    setSelectedUser(user);
    setUserDetailOpen(true);
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
  
  const handleSortChange = (sortId: string) => {
    setFilters({ sortBy: sortId });
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении сортировки
  };
  
  const handlePerPageChange = (value: string) => {
    setFilters({ perPage: parseInt(value) });
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении количества на странице
  };
  
  const handleFilterChange = () => {
    setFilterDialogOpen(false);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
    // Не сбрасываем страницу сразу, только при отправке формы
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  };
  
  const handleExport = async () => {
    try {
      // В реальном приложении:
      // const blob = await api.users.export();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
      
      // Имитация для демонстрации
      toast({
        title: "Экспорт данных",
        description: "Файл с данными пользователей будет скачан через несколько секунд"
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Успешно",
        description: "Файл users-export.csv скачан"
      });
    } catch (error) {
      console.error("Ошибка при экспорте данных:", error);
      toast({
        variant: "destructive",
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать данные пользователей"
      });
    }
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

  // Генерация элементов пагинации
  const paginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Всегда показываем первую страницу
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => setCurrentPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Если страниц больше maxVisiblePages, добавляем многоточие перед текущей страницей
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Показываем страницы вокруг текущей
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue; // Пропускаем первую и последнюю страницы
      
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Если страниц больше maxVisiblePages, добавляем многоточие после текущей страницы
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Всегда показываем последнюю страницу, если она не равна первой
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => setCurrentPage(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  }, [currentPage, totalPages]);

  return (
    <AdminLayout title="Управление пользователями">
      {/* Статистика пользователей */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            </div>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newThisWeek} новых за неделю
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-medium">Администраторы</CardTitle>
            </div>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.admins / stats.total) * 100).toFixed(1)}% от общего числа
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-medium">Новые сегодня</CardTitle>
            </div>
            <Loader2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newToday}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newToday} за последние 24 часа
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-medium">Активные пользователи</CardTitle>
            </div>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.active / stats.total) * 100).toFixed(1)}% активности
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger 
            value="all" 
            onClick={() => setFilters({ role: [] })}
          >
            Все пользователи
          </TabsTrigger>
          <TabsTrigger 
            value="admin" 
            onClick={() => setFilters({ role: ['admin'] })}
          >
            Администраторы
          </TabsTrigger>
          <TabsTrigger 
            value="user" 
            onClick={() => setFilters({ role: ['user'] })}
          >
            Пользователи
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск пользователей..."
              className="pl-10"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </form>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilterDialogOpen(true)}
            className="whitespace-nowrap"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
          
          {(filters.search || filters.role.length > 0) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                resetFilters();
                setCurrentPage(1);
              }}
              className="whitespace-nowrap"
            >
              <FilterX className="h-4 w-4 mr-2" />
              Сбросить
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="whitespace-nowrap"
          >
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          
          <Button 
            onClick={handleAddUser}
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить пользователя
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Сортировка:</span>
          <SortingPanel
            options={sortingOptions}
            activeSortId={filters.sortBy}
            onSortChange={handleSortChange}
            variant="minimal"
            size="sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Показывать по:</span>
          <Select
            value={filters.perPage.toString()}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Пользователи не найдены</h3>
          <p className="mt-1 text-gray-500">
            {filters.search || filters.role.length > 0 
              ? "Попробуйте изменить параметры поиска" 
              : "Начните с добавления нового пользователя"}
          </p>
          {(filters.search || filters.role.length > 0) && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                resetFilters();
                setCurrentPage(1);
              }}
            >
              <FilterX className="mr-2 h-4 w-4" />
              Сбросить фильтры
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
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
                {users.map((user) => (
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
                          <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Просмотреть
                          </DropdownMenuItem>
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
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1} 
                    />
                  </PaginationItem>
                  
                  {paginationItems}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages} 
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
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

      {/* Диалог фильтров */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Фильтры пользователей</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Роль</label>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={filters.role.includes('admin') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    const newRoles = filters.role.includes('admin')
                      ? filters.role.filter(r => r !== 'admin')
                      : [...filters.role, 'admin'];
                    setFilters({ role: newRoles });
                  }}
                >
                  Администратор
                </Badge>
                <Badge 
                  variant={filters.role.includes('user') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    const newRoles = filters.role.includes('user')
                      ? filters.role.filter(r => r !== 'user')
                      : [...filters.role, 'user'];
                    setFilters({ role: newRoles });
                  }}
                >
                  Пользователь
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Показывать архивные</label>
                <Switch 
                  checked={filters.showArchived}
                  onCheckedChange={(checked) => setFilters({ showArchived: checked })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => resetFilters()}
            >
              Сбросить
            </Button>
            <Button 
              onClick={handleFilterChange}
            >
              Применить
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
      
      {/* Просмотр информации о пользователе */}
      <Dialog open={userDetailOpen} onOpenChange={setUserDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Информация о пользователе</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4 space-y-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <User className="h-12 w-12" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="text-gray-500">{selectedUser.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Телефон</p>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Дата регистрации</p>
                  <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Последнее обновление</p>
                  <p className="font-medium">{formatDate(selectedUser.updatedAt)}</p>
                </div>
              </div>
              
              <div className="pt-4 flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setUserDetailOpen(false);
                    handleEdit(selectedUser);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Редактировать
                </Button>
                
                <Button 
                  onClick={() => setUserDetailOpen(false)}
                >
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;