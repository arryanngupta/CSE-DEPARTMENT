import bcrypt from 'bcrypt';

export const up = async (queryInterface) => {
  const now = new Date();
  
  // Seed admin user
  await queryInterface.bulkInsert('users', [{
    name: 'Admin',
    email: 'admin@lnmiit.ac.in',
    password_hash: await bcrypt.hash('Admin@123', 12),
    role: 'admin',
    createdAt: now,
    updatedAt: now
  }]);
  // Seed sliders
  await queryInterface.bulkInsert('sliders', [
    {
      image_path: '/uploads/images/1762345483217-188550697.png',
      caption: 'Welcome to LNMIIT Computer Science & Engineering Department',
      order: 1,
      isActive: true,
      createdAt: now,
      updatedAt: now
    },
    {
      image_path: '/uploads/images/placeholder-slide2.jpg',
      caption: 'Innovation and Excellence in Education',
      order: 2,
      isActive: true,
      createdAt: now,
      updatedAt: now
    },
    {
      image_path: '/uploads/images/placeholder-slide3.jpg',
      caption: 'Research that Transforms Lives',
      order: 3,
      isActive: true,
      createdAt: now,
      updatedAt: now
    }
  ]);

  // Seed people (faculty)
  await queryInterface.bulkInsert('people', [
    {
      name: 'Dr. Rajesh Kumar',
      designation: 'Professor & Head',
      email: 'rajesh.kumar@lnmiit.ac.in',
      webpage: 'https://lnmiit.ac.in/faculty/rajesh-kumar',
      research_areas: 'Machine Learning, Artificial Intelligence, Data Mining',
      photo_path: '/uploads/images/1762345483217-188550697.png',
      order: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Dr. Priya Sharma',
      designation: 'Associate Professor',
      email: 'priya.sharma@lnmiit.ac.in',
      webpage: 'https://lnmiit.ac.in/faculty/priya-sharma',
      research_areas: 'Computer Networks, Wireless Communication, IoT',
      photo_path: '/uploads/images/placeholder-faculty2.jpg',
      order: 2,
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Dr. Amit Verma',
      designation: 'Assistant Professor',
      email: 'amit.verma@lnmiit.ac.in',
      webpage: 'https://lnmiit.ac.in/faculty/amit-verma',
      research_areas: 'Software Engineering, Cloud Computing, DevOps',
      photo_path: '/uploads/images/placeholder-faculty3.jpg',
      order: 3,
      createdAt: now,
      updatedAt: now
    }
  ]);

  // Seed programs
  await queryInterface.bulkInsert('programs', [
    {
      name: 'B.Tech in Computer Science & Engineering',
      level: 'UG',
      description: 'A four-year undergraduate program focusing on core computer science fundamentals, programming, algorithms, and emerging technologies.',
      curriculum_pdf_path: '/uploads/pdfs/btech-cse-curriculum.pdf',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'B.Tech in Computer Science & Engineering with specialization in AI & ML',
      level: 'UG',
      description: 'Specialized undergraduate program with emphasis on artificial intelligence, machine learning, and data science.',
      curriculum_pdf_path: '/uploads/pdfs/btech-cse-aiml-curriculum.pdf',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'M.Tech in Computer Science & Engineering',
      level: 'PG',
      description: 'Two-year postgraduate program offering advanced courses in various domains of computer science with research opportunities.',
      curriculum_pdf_path: '/uploads/pdfs/mtech-cse-curriculum.pdf',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'M.Tech in Data Science',
      level: 'PG',
      description: 'Specialized postgraduate program focusing on data analytics, big data technologies, and machine learning applications.',
      curriculum_pdf_path: '/uploads/pdfs/mtech-ds-curriculum.pdf',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Ph.D. in Computer Science & Engineering',
      level: 'PhD',
      description: 'Doctoral program for aspiring researchers in various domains of computer science and engineering.',
      curriculum_pdf_path: '/uploads/pdfs/phd-cse-curriculum.pdf',
      createdAt: now,
      updatedAt: now
    }
  ]);

  // Seed news
  await queryInterface.bulkInsert('news', [
    {
      title: 'Department Hosts National Conference on AI and Machine Learning',
      date: new Date('2024-10-15'),
      summary: 'The CSE department successfully organized a three-day national conference on emerging trends in AI and ML.',
      body: 'The Computer Science & Engineering department hosted a three-day national conference on Artificial Intelligence and Machine Learning, featuring keynote speakers from leading institutions and industry experts. The conference saw participation from over 200 researchers and students across the country.',
      image_path: '/uploads/images/news-conference.jpg',
      isPublished: true,
      createdAt: now,
      updatedAt: now
    },
    {
      title: 'Students Win Best Paper Award at International Conference',
      date: new Date('2024-09-20'),
      summary: 'Final year students from the department received the Best Paper Award at IEEE International Conference.',
      body: 'A team of final year B.Tech students won the Best Paper Award at the IEEE International Conference on Computer Vision and Pattern Recognition. Their research on deep learning-based image segmentation was highly appreciated by the technical committee.',
      image_path: '/uploads/images/news-award.jpg',
      isPublished: true,
      createdAt: now,
      updatedAt: now
    },
    {
      title: 'New Research Lab Inaugurated for Quantum Computing',
      date: new Date('2024-08-10'),
      summary: 'State-of-the-art quantum computing research lab inaugurated to promote cutting-edge research.',
      body: 'The department inaugurated a new research lab dedicated to quantum computing and quantum information science. The lab is equipped with advanced simulators and computational resources to facilitate research in this emerging field.',
      image_path: '/uploads/images/news-lab.jpg',
      isPublished: true,
      createdAt: now,
      updatedAt: now
    }
  ]);

  // Seed events
  await queryInterface.bulkInsert('events', [
    {
      title: 'Tech Fest 2025 - CodeRush',
      startsAt: new Date('2025-02-15T09:00:00'),
      endsAt: new Date('2025-02-17T18:00:00'),
      venue: 'LNMIIT Campus, Auditorium Block',
      description: 'Annual technical festival featuring coding competitions, hackathons, tech talks, and workshops by industry experts.',
      link: 'https://lnmiit.ac.in/events/coderush2025',
      banner_path: '/uploads/images/event-coderush.jpg',
      isPublished: true,
      createdAt: now,
      updatedAt: now
    },
    {
      title: 'Workshop on Full Stack Web Development',
      startsAt: new Date('2025-01-20T10:00:00'),
      endsAt: new Date('2025-01-22T17:00:00'),
      venue: 'Computer Lab 3, Block B',
      description: 'Three-day intensive workshop covering React, Node.js, databases, and deployment strategies.',
      link: null,
      banner_path: '/uploads/images/event-workshop.jpg',
      isPublished: true,
      createdAt: now,
      updatedAt: now
    },
    {
      title: 'Guest Lecture Series on Cybersecurity',
      startsAt: new Date('2025-01-10T14:00:00'),
      endsAt: new Date('2025-01-10T16:00:00'),
      venue: 'Seminar Hall, Block A',
      description: 'Industry expert from leading cybersecurity firm will discuss latest trends and threats in cybersecurity.',
      link: 'https://lnmiit.ac.in/events/cybersecurity-lecture',
      banner_path: '/uploads/images/event-lecture.jpg',
      isPublished: true,
      createdAt: now,
      updatedAt: now
    }
  ]);

  // Seed achievements
  await queryInterface.bulkInsert('achievements', [
    {
      title: 'Google Summer of Code Selection',
      students: 'Rahul Agarwal, Priyanka Jain',
      description: 'Two students from the department were selected for Google Summer of Code 2024, working on open-source projects in machine learning and web development.',
      link: 'https://summerofcode.withgoogle.com',
      image_path: '/uploads/images/achievement-gsoc.jpg',
      isPublished: true,
      createdAt: now,
      updatedAt: now
    },
    {
      title: 'ACM ICPC Asia Regional Finalist',
      students: 'Kunal Sharma, Vikram Singh, Anjali Gupta',
      description: 'Team from LNMIIT qualified for ACM ICPC Asia Regional Finals after securing top position in online round.',
      link: 'https://icpc.global',
      image_path: '/uploads/images/achievement-icpc.jpg',
      isPublished: true,
      createdAt: now,
      updatedAt: now
    },
    {
      title: 'Best Startup Award at State Innovation Challenge',
      students: 'Nikhil Patel, Sneha Rao',
      description: 'Student startup focused on AI-powered educational tools won the Best Startup Award at Rajasthan State Innovation Challenge.',
      link: null,
      image_path: '/uploads/images/achievement-startup.jpg',
      isPublished: true,
      createdAt: now,
      updatedAt: now
    }
  ]);

  // Seed newsletters
  await queryInterface.bulkInsert('newsletters', [
    {
      title: 'CSE Newsletter - Winter 2024',
      issueDate: new Date('2024-12-01'),
      description: 'Quarterly newsletter featuring department updates, faculty achievements, student accomplishments, and upcoming events.',
      pdf_path: '/uploads/pdfs/newsletter-winter-2024.pdf',
      createdAt: now,
      updatedAt: now
    },
    {
      title: 'CSE Newsletter - Monsoon 2024',
      issueDate: new Date('2024-08-01'),
      description: 'Highlights from the monsoon semester including research publications, placements, and technical events.',
      pdf_path: '/uploads/pdfs/newsletter-monsoon-2024.pdf',
      createdAt: now,
      updatedAt: now
    }
  ]);

  // Seed directory entries
  await queryInterface.bulkInsert('directory_entries', [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Head of Department',
      phone: '+91-141-2445050',
      email: 'hod.cse@lnmiit.ac.in',
      location: 'Block A, Room 301',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Ms. Sunita Yadav',
      role: 'Department Administrator',
      phone: '+91-141-2445051',
      email: 'admin.cse@lnmiit.ac.in',
      location: 'Block A, Room 201',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Mr. Ramesh Choudhary',
      role: 'Lab Technician',
      phone: '+91-141-2445052',
      email: 'lab.cse@lnmiit.ac.in',
      location: 'Computer Lab 1, Block B',
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Dr. Amit Verma',
      role: 'Faculty Coordinator - Placements',
      phone: '+91-141-2445053',
      email: 'placements.cse@lnmiit.ac.in',
      location: 'Block A, Room 305',
      createdAt: now,
      updatedAt: now
    }
  ]);

  // Seed info blocks
  await queryInterface.bulkInsert('info_blocks', [
    {
      key: 'about_department',
      title: 'About the Department',
      body: 'The Computer Science and Engineering department at LNMIIT is committed to excellence in teaching, research, and innovation. Established in 2003, the department has grown to become one of the premier institutions for computer science education in Rajasthan. We offer comprehensive programs at undergraduate, postgraduate, and doctoral levels, preparing students for successful careers in academia and industry. Our faculty members are actively engaged in cutting-edge research in areas such as artificial intelligence, machine learning, data science, cybersecurity, and software engineering.',
      media_path: null,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'vision',
      title: 'Vision',
      body: 'To be a globally recognized center of excellence in computer science education and research, fostering innovation and producing skilled professionals who contribute to society and drive technological advancement.',
      media_path: null,
      createdAt: now,
      updatedAt: now
    },
    {
      key: 'mission',
      title: 'Mission',
      body: 'To provide quality education in computer science and engineering through innovative teaching methods, promote research and development, collaborate with industry and academia, and nurture ethical and socially responsible professionals.',
      media_path: null,
      createdAt: now,
      updatedAt: now
    }
  ]);
};

export const down = async (queryInterface) => {
  await queryInterface.bulkDelete('info_blocks', null, {});
  await queryInterface.bulkDelete('directory_entries', null, {});
  await queryInterface.bulkDelete('newsletters', null, {});
  await queryInterface.bulkDelete('achievements', null, {});
  await queryInterface.bulkDelete('events', null, {});
  await queryInterface.bulkDelete('news', null, {});
  await queryInterface.bulkDelete('programs', null, {});
  await queryInterface.bulkDelete('people', null, {});
  await queryInterface.bulkDelete('sliders', null, {});
  await queryInterface.bulkDelete('users', null, {});
};