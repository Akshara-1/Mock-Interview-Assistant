export const UploadFile = async ({ file }) => ({
  file_url: `http://example.com/uploads/${file.name}`,
});

export const ExtractDataFromUploadedFile = async ({ file_url, json_schema }) => ({
  status: 'success',
  output: {
    candidate_name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '987-654-3210',
    skills: ['Python', 'Data Analysis'],
    experience_years: 3,
    education: [{ degree: 'M.S. Data Science', institution: 'Data University', year: '2020' }],
    work_experience: [{ company: 'Data Corp', position: 'Analyst', duration: '2020-2023' }],
    ats_score: 92,
    recommended_domain: 'Data Science',
  },
});