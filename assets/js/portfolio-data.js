/**
 * Portfolio data — single source of truth for the Portfolio gallery.
 * Each item: { id, category, type ('image'|'video'), src, poster, title, description, liveUrl }
 * categories: ghlworks | aiprojects | ghlclaude | lovable | socialmedia | n8n
 */
window.PORTFOLIO_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'ghlworks', label: 'GHL Workflows' },
  { key: 'aiprojects', label: 'AI Projects' },
  { key: 'ghlclaude', label: 'GHL+Claude' },
  { key: 'lovable', label: 'Lovable' },
  { key: 'socialmedia', label: 'Social Media' },
  { key: 'n8n', label: 'n8N' }
];

window.PORTFOLIO_ITEMS = [
  {
    id: 'calendar-update-availability',
    category: 'ghlworks',
    type: 'video',
    src: 'https://storage.googleapis.com/msgsndr/p9KUsoKcgbHyKBcb5DJu/media/698727fa2dd9856b92a6f972.mp4',
    poster: 'assets/img/portfolio/video-placeholder.jpg',
    title: 'Calendar Update Availability',
    description: 'GHL calendar automation',
    liveUrl: null
  },
  {
    id: 'calendar-reservation',
    category: 'ghlworks',
    type: 'video',
    src: 'https://storage.googleapis.com/msgsndr/p9KUsoKcgbHyKBcb5DJu/media/698727fa5f9399242db3709d.mp4',
    poster: 'assets/img/portfolio/video-placeholder.jpg',
    title: 'Calendar Reservation',
    description: 'GHL calendar automation',
    liveUrl: null
  },
  {
    id: 'cancel-reservation',
    category: 'ghlworks',
    type: 'video',
    src: 'https://storage.googleapis.com/msgsndr/p9KUsoKcgbHyKBcb5DJu/media/698727fa2dd985868aa6f970.mp4',
    poster: 'assets/img/portfolio/video-placeholder.jpg',
    title: 'Cancel Reservation',
    description: 'GHL calendar automation',
    liveUrl: null
  },
  {
    id: 'restaurant-voice-ai-agent',
    category: 'ghlworks',
    type: 'video',
    src: 'https://storage.googleapis.com/msgsndr/p9KUsoKcgbHyKBcb5DJu/media/698727fa2dd985f8f5a6f975.mp4',
    poster: 'assets/img/portfolio/video-placeholder.jpg',
    title: 'Restaurant Voice AI Agent',
    description: 'Voice AI agent',
    liveUrl: null
  },
  {
    id: 'multi-calendar-booker',
    category: 'ghlworks',
    type: 'video',
    src: 'https://storage.googleapis.com/msgsndr/p9KUsoKcgbHyKBcb5DJu/media/698727fa5f9399493ab3709e.mp4',
    poster: 'assets/img/portfolio/video-placeholder.jpg',
    title: 'Multi Calendar Booker',
    description: 'GHL calendar automation',
    liveUrl: null
  },
  {
    id: 'sms-ai-google-review',
    category: 'ghlworks',
    type: 'video',
    src: 'https://storage.googleapis.com/msgsndr/p9KUsoKcgbHyKBcb5DJu/media/698727fa2dd985a7f4a6f976.mp4',
    poster: 'assets/img/portfolio/video-placeholder.jpg',
    title: 'SMS AI Google Review',
    description: 'SMS automation',
    liveUrl: null
  },
  {
    id: 'cleaning-cost-estimator',
    category: 'aiprojects',
    type: 'image',
    src: 'assets/img/portfolio/aiproj-cleanestimator.jpg',
    title: 'Cleaning Cost Estimator',
    description: 'Instant, ZIP-code accurate cleaning cost estimates',
    liveUrl: 'https://www.cleanestimator.com'
  },
  {
    id: 'task-management-board',
    category: 'aiprojects',
    type: 'image',
    src: 'assets/img/portfolio/aiproj-achieverboard.jpg',
    title: 'Task Management Board',
    description: 'Free Kanban board to organize tasks',
    liveUrl: 'https://www.achieverboard.com'
  },
  {
    id: 'real-estate-education-hub',
    category: 'aiprojects',
    type: 'image',
    src: 'assets/img/portfolio/aiproj-homenexio.jpg',
    title: 'Real Estate Education Hub',
    description: 'Free real estate investing & licensing education',
    liveUrl: 'https://homenexio.com'
  },
  {
    id: 'lesson-reconciler',
    category: 'aiprojects',
    type: 'image',
    src: 'assets/img/portfolio/aiproj-lessonreconciler.jpg',
    title: 'Lesson Reconciler',
    description: 'AI-powered transcript-to-plan reconciliation',
    liveUrl: 'https://claude.ai/artifact/3PgPnmdiddAFDV5LX25NtW'
  },
  {
    id: 'pristine-cleaning',
    category: 'ghlclaude',
    type: 'image',
    src: 'assets/img/portfolio/ghlclaude-pristine-cleaning.png',
    title: 'Pristine Cleaning',
    description: 'Cleaning service website built with GHL + Claude',
    liveUrl: 'https://pristine-cleaning-nine.vercel.app/'
  },
  {
    id: 'the-cleaning-sister',
    category: 'ghlclaude',
    type: 'image',
    src: 'assets/img/portfolio/ghlclaude-cleaning-sister.png',
    title: 'The Cleaning Sister',
    description: 'Cleaning service website built with GHL + Claude',
    liveUrl: 'https://the-cleaning-sister.vercel.app/'
  },
  {
    id: 'immaculate-restoration-airducts',
    category: 'ghlclaude',
    type: 'image',
    src: 'assets/img/portfolio/ghlclaude-restoration-airducts.jpg',
    title: 'Immaculate Restoration - Air Ducts & Dryer Vents',
    description: 'Service-focused landing page built with GHL + Claude',
    liveUrl: 'restoration-air-ducts-dryer-vents.html'
  },
  {
    id: 'lovable-webdesign-dentist',
    category: 'lovable',
    type: 'image',
    src: 'assets/img/portfolio/ghlwork-dentist.png',
    title: 'Lovable WebDesign Dentist',
    description: 'Website & funnel build',
    liveUrl: 'https://pdentres.eliaszoleta.com/'
  },
  {
    id: 'sale-day-campaign',
    category: 'socialmedia',
    type: 'image',
    src: 'assets/img/portfolio/social-1111-sale-day-campaign.png',
    title: '11.11 Sale Day Campaign',
    description: 'Messenger broadcast — 38K+ sent, 96% open rate',
    liveUrl: null
  },
  {
    id: 'year-end-sale-campaign',
    category: 'socialmedia',
    type: 'image',
    src: 'assets/img/portfolio/social-1212-year-end-sale-campaign.png',
    title: '12.12 Year End Sale Campaign',
    description: 'Messenger broadcast — 35K+ sent, 93% open rate',
    liveUrl: null
  },
  {
    id: 'birthday-celebration-campaign',
    category: 'socialmedia',
    type: 'image',
    src: 'assets/img/portfolio/social-birthday-celebration-campaign.png',
    title: '7th Birthday Celebration Campaign',
    description: 'Messenger broadcast — 4.6K sent, 97% open rate',
    liveUrl: null
  },
  {
    id: 'messenger-subscriber-growth',
    category: 'socialmedia',
    type: 'image',
    src: 'assets/img/portfolio/social-messenger-subscribers.png',
    title: 'Messenger Subscriber Growth',
    description: "Grew Lazada's Messenger channel to 57K+ active contacts",
    liveUrl: null
  },
  {
    id: 'messenger-campaign-history',
    category: 'socialmedia',
    type: 'image',
    src: 'assets/img/portfolio/social-messenger-campaign-list.png',
    title: 'Messenger Campaign History',
    description: 'Broadcast history — consistent 90%+ delivery across campaigns',
    liveUrl: null
  },
  {
    id: 'fb-ad-whiteglove-creative',
    category: 'socialmedia',
    type: 'image',
    src: 'assets/img/portfolio/social-fb-ad-whiteglove-creative.png',
    title: 'Facebook Ad — White Glove Cleaning',
    description: 'Facebook lead ad creative',
    liveUrl: null
  },
  {
    id: 'fb-lead-form-step1',
    category: 'socialmedia',
    type: 'image',
    src: 'assets/img/portfolio/social-fb-ad-whiteglove-form-step1.png',
    title: 'Facebook Lead Form — Service Type',
    description: 'Lead form step 1 — service selection',
    liveUrl: null
  },
  {
    id: 'fb-lead-form-step2',
    category: 'socialmedia',
    type: 'image',
    src: 'assets/img/portfolio/social-fb-ad-whiteglove-form-step2.png',
    title: 'Facebook Lead Form — Contact Info',
    description: 'Lead form step 2 — contact details capture',
    liveUrl: null
  },
  {
    id: 'n8n-ai-cold-caller-initialiser',
    category: 'n8n',
    type: 'image',
    src: 'assets/img/portfolio/n8n-ai-cold-caller-initialiser.png',
    title: 'AI Cold Caller Initialiser',
    description: 'n8n workflow that pulls Airtable records and triggers Retell AI cold calls',
    liveUrl: null
  },
  {
    id: 'n8n-sms-appointment-setter-ghl',
    category: 'n8n',
    type: 'image',
    src: 'assets/img/portfolio/n8n-sms-appointment-setter-ghl.png',
    title: 'SMS Appointment Setter (GHL)',
    description: 'AI agent with memory and knowledge base that books appointments over SMS',
    liveUrl: null
  },
  {
    id: 'n8n-voice-ai-receptionist',
    category: 'n8n',
    type: 'image',
    src: 'assets/img/portfolio/n8n-voice-ai-receptionist.png',
    title: 'n8n Ultimate — Voice AI Receptionist',
    description: 'Full voice AI receptionist flow — contact lookup, slot search, booking, cancel/reschedule',
    liveUrl: null
  },
  {
    id: 'n8n-check-ghl-calendar-avail',
    category: 'n8n',
    type: 'image',
    src: 'assets/img/portfolio/n8n-check-ghl-calendar-avail.png',
    title: 'Check GHL Calendar Availability',
    description: 'Webhook that checks Go High Level calendar slots and returns open times',
    liveUrl: null
  },
  {
    id: 'n8n-book-ghl-appointment-retell-ai',
    category: 'n8n',
    type: 'image',
    src: 'assets/img/portfolio/n8n-book-ghl-appointment-retell-ai.png',
    title: 'Book GHL Appointment with Retell AI',
    description: 'Looks up or creates the contact, then books the GHL appointment and responds to Retell',
    liveUrl: null
  },
  {
    id: 'n8n-appointment-booker',
    category: 'n8n',
    type: 'image',
    src: 'assets/img/portfolio/n8n-appointment-booker.png',
    title: 'Appointment Booker',
    description: 'Webhook-driven booking flow — creates the contact, formats the date, and books the slot via GHL',
    liveUrl: null
  },
  {
    id: 'n8n-custom-ghl-mcp-med-spa',
    category: 'n8n',
    type: 'image',
    src: 'assets/img/portfolio/n8n-custom-ghl-mcp-med-spa.png',
    title: 'Custom GHL MCP — Med Spa Template',
    description: 'Custom MCP server exposing GHL calendar tools — get slots, book, get, and delete appointments',
    liveUrl: null
  }
];
