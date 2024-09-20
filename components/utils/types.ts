export type TSubject = {
  image_url: string;
  course_name: string;
  lessons_no: number;
};

export type TCourse = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  chapters: [
    {
      _id: string;
      title: string;
      lessons: [
        {
          _id: string;
          title: string;
          sections: [
            {
              _id: string;
              title: string;
              subsections: [
                {
                  _id: string;
                  title: string;
                }
              ];
            }
          ];
        }
      ];
    }
  ];
};

export type TResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type TFetchState<T> = {
  data: T;
  loading: boolean;
  error: string | undefined | false;
};

export type THandleSearchChange<T> = (
  e: React.ChangeEvent<HTMLInputElement>,
  config: {
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    initialData: T[];
    setSearchResults: React.Dispatch<React.SetStateAction<T[]>>;
  }
) => void;
