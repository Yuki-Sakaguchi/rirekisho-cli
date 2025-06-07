export interface ResumeConfig {
  personal: {
    name: string;
    ruby: string;
    birthDate: string;
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
    period: string;
    institution: string;
    status: string;
  }>;
  experience: Array<{
    period: string;
    company: string;
    position: string;
    description: string;
  }>;
  skills: string[];
}
