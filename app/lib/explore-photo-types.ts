export type ExplorerPhoto = {
  image: string;
  url: string;
  attribution: string;
  license: string;
  licenseUrl: string;
  description?: string;
  articleUrl?: string;
};

export type ExplorerPhotoLocation = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  kind: string;
};
