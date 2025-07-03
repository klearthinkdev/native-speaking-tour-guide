import { environment } from '../../../environments/environment';

export const tokenGetter: () => string | null = () => localStorage.getItem(environment.tokenKey);

export const tokenSetter: (value: string | null) => void = (value) => {
  value !== null
    ? localStorage.setItem(environment.tokenKey, value)
    : localStorage.removeItem(environment.tokenKey);
};
