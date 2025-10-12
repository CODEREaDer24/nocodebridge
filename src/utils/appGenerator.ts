interface AppPage {
  name: string;
  route: string;
  components: string[];
}

interface AppTheme {
  primaryColor: string;
  typography: string;
}

interface AppSchema {
  name: string;
  description: string;
  pages: AppPage[];
  components: string[];
  theme: AppTheme;
  techStack: string[];
}

export async function generateAppFromIdea(idea: string): Promise<AppSchema> {
  // Simulate app generation from plain English description
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerIdea = idea.toLowerCase();
  
  // Extract app type and features
  const isTaskManager = lowerIdea.includes("task") || lowerIdea.includes("todo");
  const isBlog = lowerIdea.includes("blog") || lowerIdea.includes("article");
  const isEcommerce = lowerIdea.includes("shop") || lowerIdea.includes("store") || lowerIdea.includes("ecommerce");
  const isDashboard = lowerIdea.includes("dashboard") || lowerIdea.includes("analytics");
  
  let appName = "Generated App";
  let description = idea;
  let pages: AppPage[] = [];
  let components: string[] = [];

  if (isTaskManager) {
    appName = "Task Manager";
    pages = [
      { name: "Dashboard", route: "/", components: ["TaskList", "AddTaskForm", "FilterBar", "StatsCards"] },
      { name: "Task Details", route: "/task/:id", components: ["TaskDetail", "EditForm", "Comments"] },
      { name: "Settings", route: "/settings", components: ["UserPreferences", "NotificationSettings"] },
    ];
    components = ["TaskCard", "PriorityBadge", "DatePicker", "CategorySelector", "SearchBar"];
  } else if (isBlog) {
    appName = "Blog Platform";
    pages = [
      { name: "Home", route: "/", components: ["ArticleList", "Hero", "FeaturedPosts"] },
      { name: "Article", route: "/article/:id", components: ["ArticleView", "CommentSection", "ShareButtons"] },
      { name: "Create Post", route: "/create", components: ["RichTextEditor", "ImageUploader", "PublishForm"] },
    ];
    components = ["ArticleCard", "AuthorBio", "TagCloud", "RelatedPosts"];
  } else if (isEcommerce) {
    appName = "E-commerce Store";
    pages = [
      { name: "Shop", route: "/", components: ["ProductGrid", "FilterSidebar", "CartPreview"] },
      { name: "Product", route: "/product/:id", components: ["ProductDetail", "ImageGallery", "ReviewSection"] },
      { name: "Checkout", route: "/checkout", components: ["CartSummary", "ShippingForm", "PaymentForm"] },
    ];
    components = ["ProductCard", "AddToCartButton", "PriceDisplay", "StockIndicator"];
  } else if (isDashboard) {
    appName = "Analytics Dashboard";
    pages = [
      { name: "Overview", route: "/", components: ["StatsGrid", "ChartPanel", "RecentActivity"] },
      { name: "Reports", route: "/reports", components: ["ReportList", "FilterOptions", "ExportButton"] },
      { name: "Settings", route: "/settings", components: ["UserSettings", "DataSourceConfig"] },
    ];
    components = ["StatCard", "LineChart", "BarChart", "DataTable", "DateRangePicker"];
  } else {
    // Generic app structure
    appName = "Custom App";
    pages = [
      { name: "Home", route: "/", components: ["Hero", "FeatureList", "CTASection"] },
      { name: "About", route: "/about", components: ["AboutContent", "TeamSection"] },
      { name: "Contact", route: "/contact", components: ["ContactForm", "InfoCard"] },
    ];
    components = ["Header", "Footer", "Button", "Card", "Input"];
  }

  return {
    name: appName,
    description,
    pages,
    components,
    theme: {
      primaryColor: "Electric Blue (#3B82F6)",
      typography: "Inter / Outfit",
    },
    techStack: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui", "React Router"],
  };
}
