export interface PlatformDetection {
  platform: string;
  confidence: number;
  reason: string;
}

export const detectPlatform = (url: string, data?: any): PlatformDetection => {
  const urlLower = url.toLowerCase();
  
  // URL-based detection
  if (urlLower.includes('lovable.dev') || urlLower.includes('lovableproject.com')) {
    return {
      platform: 'Lovable',
      confidence: 95,
      reason: 'URL pattern matches Lovable domain'
    };
  }
  
  if (urlLower.includes('bubble.io')) {
    return {
      platform: 'Bubble',
      confidence: 95,
      reason: 'URL pattern matches Bubble.io domain'
    };
  }
  
  if (urlLower.includes('base44')) {
    return {
      platform: 'Base44',
      confidence: 90,
      reason: 'URL pattern matches Base44 domain'
    };
  }
  
  if (urlLower.includes('bolt.new')) {
    return {
      platform: 'Bolt',
      confidence: 90,
      reason: 'URL pattern matches Bolt domain'
    };
  }
  
  // Data structure-based detection
  if (data) {
    if (data.pages && data.components && data.routes) {
      return {
        platform: 'Lovable',
        confidence: 80,
        reason: 'JSON structure matches Lovable export format'
      };
    }
    
    if (data.workflows && data.data_types) {
      return {
        platform: 'Bubble',
        confidence: 80,
        reason: 'JSON structure matches Bubble export format'
      };
    }
    
    if (data.project && data.metadata && data.uap_version) {
      return {
        platform: 'UAP',
        confidence: 100,
        reason: 'Universal App Profile detected'
      };
    }
  }
  
  return {
    platform: 'Unknown',
    confidence: 0,
    reason: 'Could not determine platform from URL or data structure'
  };
};

export const nextStepRecommendation = (platform: string, hasData: boolean): string => {
  if (hasData) {
    return `✅ ${platform} data detected. You can now export to UAP format or analyze the structure.`;
  }
  
  switch (platform) {
    case 'Lovable':
      return '💡 To get full project data: Go to your Lovable project → Settings → Export → Download JSON';
    case 'Bubble':
      return '💡 To get full project data: In Bubble editor → Settings → General → Export application data → Download as JSON';
    case 'Base44':
      return '💡 To get full project data: Export your project configuration as JSON from Base44 settings';
    case 'Bolt':
      return '💡 To get full project data: Use Bolt\'s export feature to download project JSON';
    default:
      return '💡 Upload your exported JSON file to see the complete project structure';
  }
};
