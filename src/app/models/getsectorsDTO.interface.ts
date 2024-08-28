export interface ISector {
    id: string;
    IDsymbol: string;
    imgURL: string;
    breadColor?: string;
    contentHTML: any;
    title: any;
    preview_title: any;
    short: any;
    introTitle: any;
    description: any;
    list: any;
    keywords: any;
  }
  
  export interface SectorResponse {
    code: number;
    results: ISector | null;
    errorMessage?: string;
    error?: any;
  }