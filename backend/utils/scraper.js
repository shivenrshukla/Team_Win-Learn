// ./utils/scraper.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const { randomBytes } = require('crypto');

// Create a cookieJar to store cookies between requests
let cookies = {};

// Create logs directory if it doesn't exist
const ensureLogDir = async () => {
  const logDir = path.join(__dirname, '../logs');
  try {
    await fs.mkdir(logDir, { recursive: true });
  } catch (err) {
    console.error('Error creating log directory:', err);
  }
  return logDir;
};

// Generate random user agents
const getRandomUserAgent = () => {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.76',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

// Helper function to add delay between requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Create a reusable axios instance with interceptors for cookies
const createAxiosInstance = () => {
  const instance = axios.create({
    timeout: 15000,
    maxRedirects: 5
  });
  
  // Request interceptor to add cookies
  instance.interceptors.request.use(config => {
    // Set common headers
    config.headers = {
      ...config.headers,
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    };
    
    // Add cookies if we have any
    if (Object.keys(cookies).length > 0) {
      const cookieString = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
      
      if (cookieString) {
        config.headers['Cookie'] = cookieString;
      }
    }
    
    // Add a random client identifier
    if (!cookies['client_id']) {
      cookies['client_id'] = randomBytes(16).toString('hex');
    }
    
    return config;
  });
  
  // Response interceptor to collect cookies
  instance.interceptors.response.use(response => {
    // Extract and store cookies from the response
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      setCookieHeader.forEach(cookie => {
        const cookieParts = cookie.split(';')[0].split('=');
        if (cookieParts.length === 2) {
          const [key, value] = cookieParts;
          cookies[key] = value;
        }
      });
    }
    
    return response;
  });
  
  return instance;
};

// Create a axios instance
const axiosInstance = createAxiosInstance();

// Initialize a session by visiting the homepage
const initSession = async () => {
  try {
    console.log('Initializing session...');
    await axiosInstance.get('https://mangafire.to/', {
      headers: {
        'Referer': 'https://www.google.com/'
      }
    });
    console.log('Session initialized with cookies:', Object.keys(cookies).length);
    await delay(1000);
    return true;
  } catch (error) {
    console.error('Error initializing session:', error.message);
    return false;
  }
};

// Search for manga
const scrapeMangaSearch = async (keyword) => {
  console.log(`Searching for manga: ${keyword}`);
  
  // Initialize session first
  await initSession();
  
  // Add a delay to look more human
  await delay(Math.floor(Math.random() * 1000) + 500);
  
  const searchURL = `https://mangafire.to/filter?keyword=${encodeURIComponent(keyword)}`;
  
  try {
    // Make the request with our configured instance
    const { data } = await axiosInstance.get(searchURL, {
      headers: {
        'Referer': 'https://mangafire.to/'
      }
    });
    
    // For debugging - save the HTML response
    const logDir = await ensureLogDir();
    await fs.writeFile(path.join(logDir, `search-response-${Date.now()}.html`), data);
    
    // Parse with Cheerio
    const $ = cheerio.load(data);
    
    const results = [];
    
    // Try multiple selectors to find manga items
    const selectors = [
      '.manga-item',
      '.filter-items .item',
      '.manga-card',
      '.filter-result .filter-item',
      '.book-item'
    ];
    
    // Try each selector
    for (const selector of selectors) {
      $(selector).each((_, element) => {
        // Try to find title and link
        let titleElement = null;
        
        // Try different selectors for title/link
        for (const titleSelector of [
          '.item-title a', 
          '.manga-name a', 
          'a.name', 
          '.title a', 
          'a.title', 
          'a[href*="/manga/"]'
        ]) {
          titleElement = $(element).find(titleSelector);
          if (titleElement.length > 0) break;
        }
        
        if (titleElement && titleElement.length > 0) {
          const title = titleElement.text().trim();
          const url = new URL(titleElement.attr('href'), 'https://mangafire.to').toString();
          const mangaId = url.split('/').pop();
          
          // Try to find image
          let imageUrl = '';
          for (const imgSelector of [
            '.manga-poster img', 
            '.cover img', 
            '.thumbnail img', 
            'img'
          ]) {
            const imgElement = $(element).find(imgSelector);
            if (imgElement.length > 0) {
              imageUrl = imgElement.attr('src') || imgElement.attr('data-src') || '';
              break;
            }
          }
          
          results.push({ title, url, mangaId, imageUrl });
        }
      });
      
      // If we found results with this selector, don't try other selectors
      if (results.length > 0) break;
    }
    
    // Fallback: try to find any links that point to manga pages
    if (results.length === 0) {
      $('a[href*="/manga/"]').each((_, element) => {
        const el = $(element);
        const title = el.text().trim();
        const url = new URL(el.attr('href'), 'https://mangafire.to').toString();
        
        // Make sure this is a manga link and not a navigation element
        if (title && !title.includes('Home') && !title.includes('Login') && title.length > 1) {
          const mangaId = url.split('/').pop();
          
          // Try to find an image near this link
          let parent = element.parent;
          let imageUrl = '';
          
          for (let i = 0; i < 3 && parent; i++) {
            const img = $(parent).find('img');
            if (img.length > 0) {
              imageUrl = img.attr('src') || img.attr('data-src') || '';
              break;
            }
            parent = parent.parent;
          }
          
          results.push({ title, url, mangaId, imageUrl });
        }
      });
    }
    
    console.log(`Found ${results.length} manga results`);
    return results;
    
  } catch (error) {
    console.error('Error during manga search:', error.message);
    throw new Error(`Manga search failed: ${error.message}`);
  }
};

// Get chapter images
const scrapeChapterImages = async (chapterSlug) => {
  console.log(`Fetching chapter: ${chapterSlug}`);
  
  // Make sure we have a session
  await initSession();
  
  // Add a delay to look more human
  await delay(Math.floor(Math.random() * 1000) + 500);
  
  const chapterURL = `https://mangafire.to/read/${chapterSlug}`;
  
  try {
    // Request the chapter page
    const { data } = await axiosInstance.get(chapterURL, {
      headers: {
        'Referer': 'https://mangafire.to/'
      }
    });
    
    // For debugging - save the response
    const logDir = await ensureLogDir();
    await fs.writeFile(path.join(logDir, `chapter-response-${Date.now()}.html`), data);
    
    // Parse with Cheerio
    const $ = cheerio.load(data);
    
    // Get chapter title
    let chapterTitle = '';
    for (const titleSelector of [
      '.reader-header-title h1', 
      '.chapter-title', 
      '.reader-title'
    ]) {
      const el = $(titleSelector);
      if (el.length > 0) {
        chapterTitle = el.text().trim();
        break;
      }
    }
    
    // Find chapter images
    const images = [];
    
    // Method 1: Direct image elements
    $('.reader-content img, .reader-images img, .reader-image img, .chapter-images img').each((_, element) => {
      const src = $(element).attr('src') || $(element).attr('data-src');
      if (src && !images.includes(src)) {
        images.push(src);
      }
    });
    
    // Method 2: Look for image data in script tags
    if (images.length === 0) {
      const scriptPattern = /chapImages\s*=\s*(\[[^\]]+\])/;
      const scriptTags = $('script').toArray();
      
      for (const script of scriptTags) {
        const content = $(script).html();
        if (content && content.includes('chapImages')) {
          const match = content.match(scriptPattern);
          if (match && match[1]) {
            try {
              // Clean the JSON string and parse it
              const jsonStr = match[1].replace(/'/g, '"').replace(/,\s*]/g, ']');
              const imageData = JSON.parse(jsonStr);
              
              imageData.forEach(img => {
                if (typeof img === 'string' && !images.includes(img)) {
                  images.push(img);
                } else if (img && (img.src || img.url) && !images.includes(img.src || img.url)) {
                  images.push(img.src || img.url);
                }
              });
            } catch (err) {
              console.error('Error parsing image data from script:', err);
            }
          }
        }
      }
    }
    
    // Method 3: Extract URLs from any script content
    if (images.length === 0) {
      const urlPattern = /(https?:\/\/[^"'\s]+\.(jpg|jpeg|png|webp))/g;
      
      $('script').each((_, element) => {
        const content = $(element).html();
        if (content) {
          const matches = content.match(urlPattern);
          if (matches && matches.length > 0) {
            matches.forEach(url => {
              if (!images.includes(url)) {
                images.push(url);
              }
            });
          }
        }
      });
    }
    
    console.log(`Found ${images.length} images for chapter`);
    return {
      chapterTitle,
      images,
      totalImages: images.length
    };
    
  } catch (error) {
    console.error('Error fetching chapter:', error.message);
    throw new Error(`Failed to scrape chapter images: ${error.message}`);
  }
};

// Get manga details and chapters
const scrapeMangaChapters = async (mangaId) => {
  console.log(`Fetching chapters for manga: ${mangaId}`);
  
  // Make sure we have a session
  await initSession();
  
  // Add a delay to look more human
  await delay(Math.floor(Math.random() * 1000) + 500);
  
  const mangaURL = `https://mangafire.to/manga/${mangaId}`;
  
  try {
    // Request the manga page
    const { data } = await axiosInstance.get(mangaURL, {
      headers: {
        'Referer': 'https://mangafire.to/'
      }
    });
    
    // For debugging - save the response
    const logDir = await ensureLogDir();
    await fs.writeFile(path.join(logDir, `manga-response-${Date.now()}.html`), data);
    
    // Parse with Cheerio
    const $ = cheerio.load(data);
    
    // Get manga title
    let mangaTitle = '';
    for (const titleSelector of [
      '.manga-title h1', 
      '.series-name', 
      '.book-title', 
      'h1.title'
    ]) {
      const el = $(titleSelector);
      if (el.length > 0) {
        mangaTitle = el.text().trim();
        break;
      }
    }
    
    // Get manga cover
    let mangaCover = '';
    for (const coverSelector of [
      '.manga-poster img', 
      '.cover img', 
      '.book-cover img'
    ]) {
      const el = $(coverSelector);
      if (el.length > 0) {
        mangaCover = el.attr('src') || el.attr('data-src') || '';
        break;
      }
    }
    
    // Get synopsis
    let synopsis = '';
    for (const synopsisSelector of [
      '.manga-synopsis p', 
      '.description p', 
      '.summary p'
    ]) {
      const el = $(synopsisSelector);
      if (el.length > 0) {
        synopsis = el.text().trim();
        break;
      }
    }
    
    // Get chapters
    const chapters = [];
    
    // Try different selectors for chapter list
    const chapterSelectors = [
      '.manga-chapters .chapter-item', 
      '.chapter-list .chapter', 
      '.chapters-list li'
    ];
    
    for (const selector of chapterSelectors) {
      $(selector).each((_, element) => {
        // Find chapter link
        let chapterLink = null;
        for (const linkSelector of [
          '.chapter-title a', 
          'a.chapter-name', 
          '.name a', 
          'a'
        ]) {
          const link = $(element).find(linkSelector);
          if (link.length > 0) {
            chapterLink = link;
            break;
          }
        }
        
        if (chapterLink) {
          const title = chapterLink.text().trim();
          const url = new URL(chapterLink.attr('href'), 'https://mangafire.to').toString();
          
          // Extract chapter slug
          let chapterSlug = '';
          if (url.includes('/read/')) {
            chapterSlug = url.split('/read/')[1];
          }
          
          // Find chapter number
          let number = '';
          for (const numSelector of [
            '.chapter-number', 
            '.number', 
            '.chapter-no'
          ]) {
            const numEl = $(element).find(numSelector);
            if (numEl.length > 0) {
              number = numEl.text().trim();
              break;
            }
          }
          
          // If no number found, try to extract from title
          if (!number) {
            const match = title.match(/Chapter\s+(\d+(\.\d+)?)/i);
            if (match) {
              number = match[1];
            }
          }
          
          // Find chapter date
          let date = '';
          for (const dateSelector of [
            '.chapter-date', 
            '.date', 
            '.time'
          ]) {
            const dateEl = $(element).find(dateSelector);
            if (dateEl.length > 0) {
              date = dateEl.text().trim();
              break;
            }
          }
          
          chapters.push({
            title,
            url,
            chapterSlug,
            number,
            date
          });
        }
      });
      
      // If we found chapters, stop trying more selectors
      if (chapters.length > 0) break;
    }
    
    console.log(`Found ${chapters.length} chapters for manga`);
    return {
      mangaTitle,
      mangaCover,
      synopsis,
      chapters,
      totalChapters: chapters.length
    };
    
  } catch (error) {
    console.error('Error fetching manga chapters:', error.message);
    throw new Error(`Failed to scrape manga chapters: ${error.message}`);
  }
};

module.exports = {
  scrapeMangaSearch,
  scrapeChapterImages,
  scrapeMangaChapters
};
