export interface ResumeConfig {
  personal: {
    name: string;
    ruby: string;
    birth_day: string;
    address: {
      postal: string;
      prefecture: string;
      city: string;
      number: string;
    };
    contact: {
      phone: string;
      email: string;
    };
  };
  education: Array<{
    year: number;
    month: number;
    value: string;
  }>;
  experience: Array<{
    year: number;
    month: number;
    value: string;
  }>;
  licences: Array<{
    year: number;
    month: number;
    value: string;
  }>;
  commuting_time: string;
  dependents: string;
  spouse: string;
  supporting_spouse: string;
  hobby: string;
  motivation: string;
  request: string;
}
