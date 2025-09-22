import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Upload, Calendar, FileText, Package, FileJson, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface HistoryRecord {
  id: string;
  projectName: string;
  type: 'export' | 'import';
  format?: 'json' | 'zip' | 'markdown';
  timestamp: Date;
  size?: string;
  status: 'success' | 'failed' | 'pending';
}

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data
  const records: HistoryRecord[] = [
    {
      id: '1',
      projectName: 'E-commerce Dashboard',
      type: 'export',
      format: 'json',
      timestamp: new Date('2024-01-15T10:30:00'),
      size: '245 KB',
      status: 'success'
    },
    {
      id: '2',
      projectName: 'Portfolio Website',
      type: 'export',
      format: 'markdown',
      timestamp: new Date('2024-01-14T15:45:00'),
      size: '89 KB',
      status: 'success'
    },
    {
      id: '3',
      projectName: 'Task Manager App',
      type: 'import',
      timestamp: new Date('2024-01-13T09:15:00'),
      status: 'success'
    },
    {
      id: '4',
      projectName: 'Blog Platform',
      type: 'export',
      format: 'zip',
      timestamp: new Date('2024-01-12T14:20:00'),
      size: '512 KB',
      status: 'failed'
    },
    {
      id: '5',
      projectName: 'Social Media Tool',
      type: 'import',
      timestamp: new Date('2024-01-11T11:00:00'),
      status: 'pending'
    }
  ];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || record.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success text-success-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getFormatIcon = (format?: string) => {
    switch (format) {
      case 'json': return FileJson;
      case 'zip': return Package;
      case 'markdown': return FileText;
      default: return FileText;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Wizard
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">Export & Import History</h1>
          <p className="text-xl text-muted-foreground">
            Track all your project exports and imports
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="export">Exports</TabsTrigger>
                  <TabsTrigger value="import">Imports</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No records found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start by exporting or importing a project'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRecords.map((record) => {
              const FormatIcon = getFormatIcon(record.format);
              return (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                          {record.type === 'export' ? (
                            <Download className="w-6 h-6 text-primary" />
                          ) : (
                            <Upload className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{record.projectName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`capitalize ${record.type === 'export' ? 'text-primary' : 'text-secondary-foreground'}`}
                            >
                              {record.type}
                            </Badge>
                            {record.format && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <FormatIcon className="w-3 h-3" />
                                {record.format.toUpperCase()}
                              </Badge>
                            )}
                            {record.size && (
                              <span className="text-sm text-muted-foreground">
                                {record.size}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(record.timestamp)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Your export and import statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {records.filter(r => r.type === 'export').length}
                </div>
                <div className="text-sm text-muted-foreground">Total Exports</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {records.filter(r => r.type === 'import').length}
                </div>
                <div className="text-sm text-muted-foreground">Total Imports</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {records.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {new Set(records.map(r => r.projectName)).size}
                </div>
                <div className="text-sm text-muted-foreground">Unique Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}