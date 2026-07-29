export type SearchSuggestionType = "pin" | "user";

export type SearchSuggestion = {
  type: SearchSuggestionType;
  id: string;
  label: string;
  subtitle: string;
  imageUrl?: string;
};

export type SearchSuggestionResponse = {
  data: SearchSuggestion[];
};

export type ActiveSearch = {
  query: string;
  label: string;
  type?: SearchSuggestionType;
  id?: string;
};
