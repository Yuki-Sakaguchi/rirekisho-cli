export interface ResumeConfig {
  personal: {
    name: string;
    ruby: string;
    birth_day: string;
    gender: string;
    email: string;
    phone: string;
    address: {
      zip: string;
      value_ruby: string;
      value: string;
      phone: string;
      fax: string;
    };
    contact: {
      zip: string;
      value_ruby: string;
      value: string;
      phone: string;
      fax: string;
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
