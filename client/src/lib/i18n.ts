import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: "English",
  id: "Bahasa Indonesia", 
  vi: "Tiếng Việt",
  ar: "العربية"
} as const;

export type Language = keyof typeof SUPPORTED_LANGUAGES;

// Translation keys and their values
interface Translations {
  // Navigation
  nav: {
    home: string;
    products: string;
    about: string;
    contact: string;
    requestQuote: string;
  };

  // Hero section
  hero: {
    title: string;
    subtitle: string;
    description: string;
    browseProducts: string;
    getQuote: string;
  };

  // Stats
  stats: {
    countriesServed: string;
    premiumProducts: string;
    yearsExcellence: string;
    clientSatisfaction: string;
  };

  // Products
  products: {
    title: string;
    searchPlaceholder: string;
    allCategories: string;
    sortBy: string;
    nameAZ: string;
    nameZA: string;
    newestFirst: string;
    oldestFirst: string;
    highestRated: string;
    mostPopular: string;
    viewDetails: string;
    quote: string;
    requestQuote: string;
    volume: string;
    weight: string;
    brixLevel: string;
    views: string;
    noProductsFound: string;
    clearFilters: string;
    loadMore: string;
  };

  // Categories
  categories: {
    freshFruits: string;
    vegetables: string;
    spicesHerbs: string;
    grainsCereals: string;
    processedProducts: string;
  };

  // Product details
  productDetail: {
    specifications: string;
    description: string;
    relatedProducts: string;
    share: string;
    wishlist: string;
    qualityAssured: string;
    globalShipping: string;
    certified: string;
  };

  // Features
  features: {
    whyChoose: string;
    qualityAssurance: string;
    qualityAssuranceDesc: string;
    globalLogistics: string;
    globalLogisticsDesc: string;
    sustainablePractices: string;
    sustainablePracticesDesc: string;
  };

  // Quote form
  quote: {
    title: string;
    description: string;
    fullName: string;
    email: string;
    company: string;
    phone: string;
    country: string;
    productCategory: string;
    productDetails: string;
    estimatedQuantity: string;
    deliveryPort: string;
    submitRequest: string;
    cancel: string;
    submitting: string;
    success: string;
    successMessage: string;
    termsAgree: string;
    required: string;
  };

  // Contact
  contact: {
    title: string;
    subtitle: string;
    address: string;
    phone: string;
    email: string;
    businessHours: string;
    followUs: string;
    sendMessage: string;
    name: string;
    subject: string;
    message: string;
    send: string;
  };

  // Admin
  admin: {
    dashboard: string;
    welcome: string;
    totalProducts: string;
    activeProducts: string;
    quoteRequests: string;
    messages: string;
    products: string;
    quotes: string;
    addProduct: string;
    editProduct: string;
    productName: string;
    productDescription: string;
    category: string;
    active: string;
    inactive: string;
    featured: string;
    save: string;
    delete: string;
    edit: string;
  };

  // Authentication
  auth: {
    login: string;
    register: string;
    username: string;
    password: string;
    confirmPassword: string;
    signIn: string;
    createAccount: string;
    adminPortal: string;
    secureAccess: string;
    userManagement: string;
    globalOperations: string;
    loginFailed: string;
    registrationFailed: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    close: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    search: string;
    filter: string;
    clear: string;
    submit: string;
    back: string;
    next: string;
    previous: string;
    page: string;
    of: string;
    results: string;
    showing: string;
  };

  // Footer
  footer: {
    description: string;
    quickLinks: string;
    productCategories: string;
    contactInfo: string;
    privacyPolicy: string;
    termsOfService: string;
    cookiePolicy: string;
    allRightsReserved: string;
  };
}

// English translations (default)
const enTranslations: Translations = {
  nav: {
    home: "Home",
    products: "Products", 
    about: "About",
    contact: "Contact",
    requestQuote: "Request Quote"
  },
  hero: {
    title: "Premium Agricultural Exports Worldwide",
    subtitle: "Global Export Leader",
    description: "Connecting global markets with the finest quality agricultural products. From fresh produce to processed goods, we deliver excellence across continents.",
    browseProducts: "Browse Products",
    getQuote: "Get Quote"
  },
  stats: {
    countriesServed: "Countries Served",
    premiumProducts: "Premium Products", 
    yearsExcellence: "Years Excellence",
    clientSatisfaction: "Client Satisfaction"
  },
  products: {
    title: "Our Premium Products",
    searchPlaceholder: "Search products...",
    allCategories: "All Categories",
    sortBy: "Sort by",
    nameAZ: "Name A-Z",
    nameZA: "Name Z-A", 
    newestFirst: "Newest First",
    oldestFirst: "Oldest First",
    highestRated: "Highest Rated",
    mostPopular: "Most Popular",
    viewDetails: "View Details",
    quote: "Quote",
    requestQuote: "Request Quote",
    volume: "Volume",
    weight: "Weight",
    brixLevel: "Brix Level",
    views: "views",
    noProductsFound: "No products found",
    clearFilters: "Clear Filters",
    loadMore: "Load More Products"
  },
  categories: {
    freshFruits: "Fresh Fruits",
    vegetables: "Vegetables",
    spicesHerbs: "Spices & Herbs", 
    grainsCereals: "Grains & Cereals",
    processedProducts: "Processed Products"
  },
  productDetail: {
    specifications: "Product Specifications",
    description: "Product Description", 
    relatedProducts: "Related Products",
    share: "Share",
    wishlist: "Wishlist",
    qualityAssured: "Quality Assured",
    globalShipping: "Global Shipping",
    certified: "Certified"
  },
  features: {
    whyChoose: "Why Choose GlobalExport",
    qualityAssurance: "Quality Assurance",
    qualityAssuranceDesc: "ISO certified processes and international standards compliance ensuring premium quality products.",
    globalLogistics: "Global Logistics", 
    globalLogisticsDesc: "Efficient shipping and delivery network covering 50+ countries with reliable tracking systems.",
    sustainablePractices: "Sustainable Practices",
    sustainablePracticesDesc: "Environmentally responsible farming and packaging methods supporting sustainable agriculture."
  },
  quote: {
    title: "Request Quote",
    description: "Fill out the form below and we'll get back to you with a personalized quote within 24 hours.",
    fullName: "Full Name",
    email: "Email Address",
    company: "Company Name", 
    phone: "Phone Number",
    country: "Country",
    productCategory: "Product Category",
    productDetails: "Product Details",
    estimatedQuantity: "Estimated Quantity",
    deliveryPort: "Delivery Port",
    submitRequest: "Submit Request",
    cancel: "Cancel",
    submitting: "Submitting...",
    success: "Quote Request Submitted!",
    successMessage: "Thank you for your interest. Our team will review your request and get back to you within 24 hours.",
    termsAgree: "I agree to the terms and conditions and privacy policy",
    required: "required"
  },
  contact: {
    title: "Get In Touch",
    subtitle: "Ready to start your export journey? Contact us today for personalized service",
    address: "Address",
    phone: "Phone", 
    email: "Email",
    businessHours: "Business Hours",
    followUs: "Follow Us",
    sendMessage: "Send us a Message",
    name: "Name",
    subject: "Subject",
    message: "Message",
    send: "Send Message"
  },
  admin: {
    dashboard: "Admin Dashboard",
    welcome: "Welcome back",
    totalProducts: "Total Products",
    activeProducts: "Active Products",
    quoteRequests: "Quote Requests", 
    messages: "Messages",
    products: "Products",
    quotes: "Quotes",
    addProduct: "Add Product",
    editProduct: "Edit Product",
    productName: "Product Name",
    productDescription: "Product Description",
    category: "Category",
    active: "Active",
    inactive: "Inactive",
    featured: "Featured",
    save: "Save",
    delete: "Delete",
    edit: "Edit"
  },
  auth: {
    login: "Login",
    register: "Register",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    signIn: "Sign In",
    createAccount: "Create Account",
    adminPortal: "Admin Portal",
    secureAccess: "Secure Access",
    userManagement: "User Management", 
    globalOperations: "Global Operations",
    loginFailed: "Login failed",
    registrationFailed: "Registration failed"
  },
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit", 
    add: "Add",
    remove: "Remove",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    submit: "Submit",
    back: "Back",
    next: "Next",
    previous: "Previous",
    page: "Page",
    of: "of",
    results: "results",
    showing: "Showing"
  },
  footer: {
    description: "Your trusted partner for premium agricultural exports worldwide. Quality, reliability, and sustainability at the heart of everything we do.",
    quickLinks: "Quick Links",
    productCategories: "Product Categories",
    contactInfo: "Contact Info",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service", 
    cookiePolicy: "Cookie Policy",
    allRightsReserved: "All rights reserved"
  }
};

// Indonesian translations
const idTranslations: Translations = {
  nav: {
    home: "Beranda",
    products: "Produk",
    about: "Tentang",
    contact: "Kontak",
    requestQuote: "Minta Penawaran"
  },
  hero: {
    title: "Ekspor Pertanian Premium ke Seluruh Dunia",
    subtitle: "Pemimpin Ekspor Global",
    description: "Menghubungkan pasar global dengan produk pertanian berkualitas terbaik. Dari produk segar hingga olahan, kami menghadirkan keunggulan di seluruh benua.",
    browseProducts: "Jelajahi Produk",
    getQuote: "Dapatkan Penawaran"
  },
  stats: {
    countriesServed: "Negara Dilayani",
    premiumProducts: "Produk Premium",
    yearsExcellence: "Tahun Keunggulan",
    clientSatisfaction: "Kepuasan Klien"
  },
  products: {
    title: "Produk Premium Kami",
    searchPlaceholder: "Cari produk...",
    allCategories: "Semua Kategori",
    sortBy: "Urutkan berdasarkan",
    nameAZ: "Nama A-Z",
    nameZA: "Nama Z-A",
    newestFirst: "Terbaru Dulu",
    oldestFirst: "Terlama Dulu", 
    highestRated: "Rating Tertinggi",
    mostPopular: "Paling Populer",
    viewDetails: "Lihat Detail",
    quote: "Penawaran",
    requestQuote: "Minta Penawaran",
    volume: "Volume",
    weight: "Berat",
    brixLevel: "Tingkat Brix",
    views: "tayangan",
    noProductsFound: "Produk tidak ditemukan",
    clearFilters: "Hapus Filter",
    loadMore: "Muat Lebih Banyak Produk"
  },
  categories: {
    freshFruits: "Buah Segar",
    vegetables: "Sayuran",
    spicesHerbs: "Rempah & Herbal",
    grainsCereals: "Biji-bijian & Sereal",
    processedProducts: "Produk Olahan"
  },
  productDetail: {
    specifications: "Spesifikasi Produk",
    description: "Deskripsi Produk",
    relatedProducts: "Produk Terkait",
    share: "Bagikan",
    wishlist: "Daftar Keinginan",
    qualityAssured: "Kualitas Terjamin",
    globalShipping: "Pengiriman Global",
    certified: "Bersertifikat"
  },
  features: {
    whyChoose: "Mengapa Memilih GlobalExport",
    qualityAssurance: "Jaminan Kualitas",
    qualityAssuranceDesc: "Proses bersertifikat ISO dan kepatuhan standar internasional memastikan produk berkualitas premium.",
    globalLogistics: "Logistik Global",
    globalLogisticsDesc: "Jaringan pengiriman yang efisien mencakup 50+ negara dengan sistem pelacakan yang andal.",
    sustainablePractices: "Praktik Berkelanjutan",
    sustainablePracticesDesc: "Metode pertanian dan kemasan yang bertanggung jawab terhadap lingkungan mendukung pertanian berkelanjutan."
  },
  quote: {
    title: "Minta Penawaran",
    description: "Isi formulir di bawah ini dan kami akan menghubungi Anda dengan penawaran yang dipersonalisasi dalam 24 jam.",
    fullName: "Nama Lengkap",
    email: "Alamat Email",
    company: "Nama Perusahaan",
    phone: "Nomor Telepon",
    country: "Negara",
    productCategory: "Kategori Produk",
    productDetails: "Detail Produk",
    estimatedQuantity: "Perkiraan Kuantitas",
    deliveryPort: "Pelabuhan Pengiriman",
    submitRequest: "Kirim Permintaan",
    cancel: "Batal",
    submitting: "Mengirim...",
    success: "Permintaan Penawaran Terkirim!",
    successMessage: "Terima kasih atas minat Anda. Tim kami akan meninjau permintaan Anda dan menghubungi Anda dalam 24 jam.",
    termsAgree: "Saya setuju dengan syarat dan ketentuan serta kebijakan privasi",
    required: "wajib"
  },
  contact: {
    title: "Hubungi Kami",
    subtitle: "Siap memulai perjalanan ekspor Anda? Hubungi kami hari ini untuk layanan yang dipersonalisasi",
    address: "Alamat",
    phone: "Telepon",
    email: "Email",
    businessHours: "Jam Kerja",
    followUs: "Ikuti Kami",
    sendMessage: "Kirim Pesan",
    name: "Nama",
    subject: "Subjek",
    message: "Pesan",
    send: "Kirim Pesan"
  },
  admin: {
    dashboard: "Dashboard Admin",
    welcome: "Selamat datang kembali",
    totalProducts: "Total Produk",
    activeProducts: "Produk Aktif",
    quoteRequests: "Permintaan Penawaran",
    messages: "Pesan",
    products: "Produk",
    quotes: "Penawaran",
    addProduct: "Tambah Produk",
    editProduct: "Edit Produk",
    productName: "Nama Produk",
    productDescription: "Deskripsi Produk",
    category: "Kategori",
    active: "Aktif",
    inactive: "Tidak Aktif",
    featured: "Unggulan",
    save: "Simpan",
    delete: "Hapus",
    edit: "Edit"
  },
  auth: {
    login: "Masuk",
    register: "Daftar",
    username: "Nama Pengguna",
    password: "Kata Sandi",
    confirmPassword: "Konfirmasi Kata Sandi",
    signIn: "Masuk",
    createAccount: "Buat Akun",
    adminPortal: "Portal Admin",
    secureAccess: "Akses Aman",
    userManagement: "Manajemen Pengguna",
    globalOperations: "Operasi Global",
    loginFailed: "Login gagal",
    registrationFailed: "Pendaftaran gagal"
  },
  common: {
    loading: "Memuat...",
    error: "Kesalahan",
    success: "Berhasil",
    close: "Tutup",
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    edit: "Edit",
    add: "Tambah",
    remove: "Hapus",
    search: "Cari",
    filter: "Filter",
    clear: "Hapus",
    submit: "Kirim",
    back: "Kembali",
    next: "Selanjutnya",
    previous: "Sebelumnya",
    page: "Halaman",
    of: "dari",
    results: "hasil",
    showing: "Menampilkan"
  },
  footer: {
    description: "Mitra terpercaya Anda untuk ekspor pertanian premium di seluruh dunia. Kualitas, keandalan, dan keberlanjutan di jantung segala yang kami lakukan.",
    quickLinks: "Tautan Cepat",
    productCategories: "Kategori Produk",
    contactInfo: "Info Kontak",
    privacyPolicy: "Kebijakan Privasi",
    termsOfService: "Syarat Layanan",
    cookiePolicy: "Kebijakan Cookie",
    allRightsReserved: "Semua hak dilindungi"
  }
};

// Vietnamese translations
const viTranslations: Translations = {
  nav: {
    home: "Trang Chủ",
    products: "Sản Phẩm",
    about: "Giới Thiệu",
    contact: "Liên Hệ",
    requestQuote: "Yêu Cầu Báo Giá"
  },
  hero: {
    title: "Xuất Khẩu Nông Sản Cao Cấp Toàn Cầu",
    subtitle: "Dẫn Đầu Xuất Khẩu Toàn Cầu",
    description: "Kết nối thị trường toàn cầu với các sản phẩm nông nghiệp chất lượng tốt nhất. Từ sản phẩm tươi sống đến chế biến, chúng tôi mang đến sự xuất sắc trên khắp các châu lục.",
    browseProducts: "Duyệt Sản Phẩm",
    getQuote: "Nhận Báo Giá"
  },
  stats: {
    countriesServed: "Quốc Gia Phục Vụ",
    premiumProducts: "Sản Phẩm Cao Cấp",
    yearsExcellence: "Năm Xuất Sắc",
    clientSatisfaction: "Sự Hài Lòng Khách Hàng"
  },
  products: {
    title: "Sản Phẩm Cao Cấp Của Chúng Tôi",
    searchPlaceholder: "Tìm kiếm sản phẩm...",
    allCategories: "Tất Cả Danh Mục",
    sortBy: "Sắp xếp theo",
    nameAZ: "Tên A-Z",
    nameZA: "Tên Z-A",
    newestFirst: "Mới Nhất Trước",
    oldestFirst: "Cũ Nhất Trước",
    highestRated: "Đánh Giá Cao Nhất",
    mostPopular: "Phổ Biến Nhất",
    viewDetails: "Xem Chi Tiết",
    quote: "Báo Giá",
    requestQuote: "Yêu Cầu Báo Giá",
    volume: "Khối Lượng",
    weight: "Trọng Lượng",
    brixLevel: "Độ Brix",
    views: "lượt xem",
    noProductsFound: "Không tìm thấy sản phẩm",
    clearFilters: "Xóa Bộ Lọc",
    loadMore: "Tải Thêm Sản Phẩm"
  },
  categories: {
    freshFruits: "Trái Cây Tươi",
    vegetables: "Rau Củ",
    spicesHerbs: "Gia Vị & Thảo Mộc",
    grainsCereals: "Ngũ Cốc",
    processedProducts: "Sản Phẩm Chế Biến"
  },
  productDetail: {
    specifications: "Thông Số Sản Phẩm",
    description: "Mô Tả Sản Phẩm",
    relatedProducts: "Sản Phẩm Liên Quan",
    share: "Chia Sẻ",
    wishlist: "Danh Sách Yêu Thích",
    qualityAssured: "Đảm Bảo Chất Lượng",
    globalShipping: "Vận Chuyển Toàn Cầu",
    certified: "Chứng Nhận"
  },
  features: {
    whyChoose: "Tại Sao Chọn GlobalExport",
    qualityAssurance: "Đảm Bảo Chất Lượng",
    qualityAssuranceDesc: "Quy trình được chứng nhận ISO và tuân thủ tiêu chuẩn quốc tế đảm bảo sản phẩm chất lượng cao cấp.",
    globalLogistics: "Logistics Toàn Cầu",
    globalLogisticsDesc: "Mạng lưới vận chuyển hiệu quả bao phủ 50+ quốc gia với hệ thống theo dõi đáng tin cậy.",
    sustainablePractices: "Thực Hành Bền Vững",
    sustainablePracticesDesc: "Phương pháp canh tác và đóng gói có trách nhiệm với môi trường hỗ trợ nông nghiệp bền vững."
  },
  quote: {
    title: "Yêu Cầu Báo Giá",
    description: "Điền vào biểu mẫu bên dưới và chúng tôi sẽ liên hệ với bạn với báo giá cá nhân hóa trong vòng 24 giờ.",
    fullName: "Họ Và Tên",
    email: "Địa Chỉ Email",
    company: "Tên Công Ty",
    phone: "Số Điện Thoại",
    country: "Quốc Gia",
    productCategory: "Danh Mục Sản Phẩm",
    productDetails: "Chi Tiết Sản Phẩm",
    estimatedQuantity: "Số Lượng Ước Tính",
    deliveryPort: "Cảng Giao Hàng",
    submitRequest: "Gửi Yêu Cầu",
    cancel: "Hủy",
    submitting: "Đang gửi...",
    success: "Yêu Cầu Báo Giá Đã Được Gửi!",
    successMessage: "Cảm ơn bạn đã quan tâm. Đội ngũ của chúng tôi sẽ xem xét yêu cầu của bạn và liên hệ lại trong vòng 24 giờ.",
    termsAgree: "Tôi đồng ý với các điều khoản và điều kiện cũng như chính sách bảo mật",
    required: "bắt buộc"
  },
  contact: {
    title: "Liên Hệ",
    subtitle: "Sẵn sàng bắt đầu hành trình xuất khẩu của bạn? Liên hệ với chúng tôi ngay hôm nay để được phục vụ cá nhân hóa",
    address: "Địa Chỉ",
    phone: "Điện Thoại",
    email: "Email",
    businessHours: "Giờ Làm Việc",
    followUs: "Theo Dõi Chúng Tôi",
    sendMessage: "Gửi Tin Nhắn",
    name: "Tên",
    subject: "Chủ Đề",
    message: "Tin Nhắn",
    send: "Gửi Tin Nhắn"
  },
  admin: {
    dashboard: "Bảng Điều Khiển Admin",
    welcome: "Chào mừng trở lại",
    totalProducts: "Tổng Sản Phẩm",
    activeProducts: "Sản Phẩm Hoạt Động",
    quoteRequests: "Yêu Cầu Báo Giá",
    messages: "Tin Nhắn",
    products: "Sản Phẩm",
    quotes: "Báo Giá",
    addProduct: "Thêm Sản Phẩm",
    editProduct: "Chỉnh Sửa Sản Phẩm",
    productName: "Tên Sản Phẩm",
    productDescription: "Mô Tả Sản Phẩm",
    category: "Danh Mục",
    active: "Hoạt Động",
    inactive: "Không Hoạt Động",
    featured: "Nổi Bật",
    save: "Lưu",
    delete: "Xóa",
    edit: "Chỉnh Sửa"
  },
  auth: {
    login: "Đăng Nhập",
    register: "Đăng Ký",
    username: "Tên Đăng Nhập",
    password: "Mật Khẩu",
    confirmPassword: "Xác Nhận Mật Khẩu",
    signIn: "Đăng Nhập",
    createAccount: "Tạo Tài Khoản",
    adminPortal: "Cổng Admin",
    secureAccess: "Truy Cập Bảo Mật",
    userManagement: "Quản Lý Người Dùng",
    globalOperations: "Hoạt Động Toàn Cầu",
    loginFailed: "Đăng nhập thất bại",
    registrationFailed: "Đăng ký thất bại"
  },
  common: {
    loading: "Đang tải...",
    error: "Lỗi",
    success: "Thành Công",
    close: "Đóng",
    save: "Lưu",
    cancel: "Hủy",
    delete: "Xóa",
    edit: "Chỉnh Sửa",
    add: "Thêm",
    remove: "Xóa",
    search: "Tìm Kiếm",
    filter: "Bộ Lọc",
    clear: "Xóa",
    submit: "Gửi",
    back: "Quay Lại",
    next: "Tiếp Theo",
    previous: "Trước",
    page: "Trang",
    of: "của",
    results: "kết quả",
    showing: "Hiển thị"
  },
  footer: {
    description: "Đối tác đáng tin cậy của bạn cho xuất khẩu nông sản cao cấp trên toàn thế giới. Chất lượng, độ tin cậy và tính bền vững là trọng tâm của mọi việc chúng tôi làm.",
    quickLinks: "Liên Kết Nhanh",
    productCategories: "Danh Mục Sản Phẩm",
    contactInfo: "Thông Tin Liên Hệ",
    privacyPolicy: "Chính Sách Bảo Mật",
    termsOfService: "Điều Khoản Dịch Vụ",
    cookiePolicy: "Chính Sách Cookie",
    allRightsReserved: "Tất cả quyền được bảo lưu"
  }
};

// Arabic translations
const arTranslations: Translations = {
  nav: {
    home: "الرئيسية",
    products: "المنتجات",
    about: "حول",
    contact: "اتصل",
    requestQuote: "طلب عرض سعر"
  },
  hero: {
    title: "صادرات زراعية متميزة عالمياً",
    subtitle: "رائد الصادرات العالمية",
    description: "ربط الأسواق العالمية بأجود المنتجات الزراعية. من المنتجات الطازجة إلى المعالجة، نقدم التميز عبر القارات.",
    browseProducts: "تصفح المنتجات",
    getQuote: "احصل على عرض سعر"
  },
  stats: {
    countriesServed: "الدول المخدومة",
    premiumProducts: "المنتجات المتميزة",
    yearsExcellence: "سنوات التميز",
    clientSatisfaction: "رضا العملاء"
  },
  products: {
    title: "منتجاتنا المتميزة",
    searchPlaceholder: "البحث عن المنتجات...",
    allCategories: "جميع الفئات",
    sortBy: "ترتيب حسب",
    nameAZ: "الاسم أ-ي",
    nameZA: "الاسم ي-أ",
    newestFirst: "الأحدث أولاً",
    oldestFirst: "الأقدم أولاً",
    highestRated: "الأعلى تقييماً",
    mostPopular: "الأكثر شعبية",
    viewDetails: "عرض التفاصيل",
    quote: "عرض سعر",
    requestQuote: "طلب عرض سعر",
    volume: "الحجم",
    weight: "الوزن",
    brixLevel: "مستوى البريكس",
    views: "مشاهدة",
    noProductsFound: "لم يتم العثور على منتجات",
    clearFilters: "مسح المرشحات",
    loadMore: "تحميل المزيد من المنتجات"
  },
  categories: {
    freshFruits: "الفواكه الطازجة",
    vegetables: "الخضروات",
    spicesHerbs: "التوابل والأعشاب",
    grainsCereals: "الحبوب والقمح",
    processedProducts: "المنتجات المعالجة"
  },
  productDetail: {
    specifications: "مواصفات المنتج",
    description: "وصف المنتج",
    relatedProducts: "المنتجات ذات الصلة",
    share: "مشاركة",
    wishlist: "قائمة الرغبات",
    qualityAssured: "جودة مضمونة",
    globalShipping: "شحن عالمي",
    certified: "معتمد"
  },
  features: {
    whyChoose: "لماذا تختار GlobalExport",
    qualityAssurance: "ضمان الجودة",
    qualityAssuranceDesc: "عمليات معتمدة من ISO وامتثال للمعايير الدولية لضمان منتجات عالية الجودة.",
    globalLogistics: "لوجستيات عالمية",
    globalLogisticsDesc: "شبكة شحن وتوصيل فعالة تغطي أكثر من 50 دولة مع أنظمة تتبع موثوقة.",
    sustainablePractices: "ممارسات مستدامة",
    sustainablePracticesDesc: "طرق زراعة وتعبئة مسؤولة بيئياً تدعم الزراعة المستدامة."
  },
  quote: {
    title: "طلب عرض سعر",
    description: "املأ النموذج أدناه وسنتواصل معك بعرض سعر مخصص خلال 24 ساعة.",
    fullName: "الاسم الكامل",
    email: "عنوان البريد الإلكتروني",
    company: "اسم الشركة",
    phone: "رقم الهاتف",
    country: "الدولة",
    productCategory: "فئة المنتج",
    productDetails: "تفاصيل المنتج",
    estimatedQuantity: "الكمية المقدرة",
    deliveryPort: "ميناء التسليم",
    submitRequest: "إرسال الطلب",
    cancel: "إلغاء",
    submitting: "جاري الإرسال...",
    success: "تم إرسال طلب عرض السعر!",
    successMessage: "شكراً لاهتمامك. سيقوم فريقنا بمراجعة طلبك والتواصل معك خلال 24 ساعة.",
    termsAgree: "أوافق على الشروط والأحكام وسياسة الخصوصية",
    required: "مطلوب"
  },
  contact: {
    title: "تواصل معنا",
    subtitle: "مستعد لبدء رحلة التصدير؟ تواصل معنا اليوم للحصول على خدمة مخصصة",
    address: "العنوان",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    businessHours: "ساعات العمل",
    followUs: "تابعنا",
    sendMessage: "أرسل رسالة",
    name: "الاسم",
    subject: "الموضوع",
    message: "الرسالة",
    send: "إرسال الرسالة"
  },
  admin: {
    dashboard: "لوحة تحكم الإدارة",
    welcome: "مرحباً بك مرة أخرى",
    totalProducts: "إجمالي المنتجات",
    activeProducts: "المنتجات النشطة",
    quoteRequests: "طلبات عروض الأسعار",
    messages: "الرسائل",
    products: "المنتجات",
    quotes: "عروض الأسعار",
    addProduct: "إضافة منتج",
    editProduct: "تحرير المنتج",
    productName: "اسم المنتج",
    productDescription: "وصف المنتج",
    category: "الفئة",
    active: "نشط",
    inactive: "غير نشط",
    featured: "مميز",
    save: "حفظ",
    delete: "حذف",
    edit: "تحرير"
  },
  auth: {
    login: "تسجيل الدخول",
    register: "التسجيل",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    signIn: "تسجيل الدخول",
    createAccount: "إنشاء حساب",
    adminPortal: "بوابة الإدارة",
    secureAccess: "وصول آمن",
    userManagement: "إدارة المستخدمين",
    globalOperations: "العمليات العالمية",
    loginFailed: "فشل تسجيل الدخول",
    registrationFailed: "فشل التسجيل"
  },
  common: {
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    close: "إغلاق",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تحرير",
    add: "إضافة",
    remove: "إزالة",
    search: "بحث",
    filter: "مرشح",
    clear: "مسح",
    submit: "إرسال",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    page: "صفحة",
    of: "من",
    results: "نتائج",
    showing: "عرض"
  },
  footer: {
    description: "شريكك الموثوق لصادرات زراعية متميزة عالمياً. الجودة والموثوقية والاستدامة في قلب كل ما نقوم به.",
    quickLinks: "روابط سريعة",
    productCategories: "فئات المنتجات",
    contactInfo: "معلومات الاتصال",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    cookiePolicy: "سياسة ملفات تعريف الارتباط",
    allRightsReserved: "جميع الحقوق محفوظة"
  }
};

// Translation map
const translations: Record<Language, Translations> = {
  en: enTranslations,
  id: idTranslations,
  vi: viTranslations,
  ar: arTranslations
};

// i18n Context
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// i18n Provider
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Get from localStorage or default to English
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      if (saved && saved in SUPPORTED_LANGUAGES) {
        return saved;
      }
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);

    // Set document direction for RTL languages
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // Translation function with nested key support
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            return key; // Return key if not found in fallback
          }
        }
        break;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return React.createElement(
    I18nContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
}

// Hook to use i18n
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Utility function for getting translation without hook
export function getTranslation(key: string, lang: Language = "en"): string {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      value = translations.en;
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return key;
        }
      }
      break;
    }
  }

  return typeof value === "string" ? value : key;
}

// Format functions for different locales
export function formatNumber(num: number, lang: Language = "en"): string {
  const locales = {
    en: "en-US",
    id: "id-ID", 
    vi: "vi-VN",
    ar: "ar-SA"
  };

  return new Intl.NumberFormat(locales[lang]).format(num);
}

export function formatCurrency(amount: number, currency: string = "USD", lang: Language = "en"): string {
  const locales = {
    en: "en-US",
    id: "id-ID",
    vi: "vi-VN", 
    ar: "ar-SA"
  };

  return new Intl.NumberFormat(locales[lang], {
    style: "currency",
    currency: currency
  }).format(amount);
}

export function formatDate(date: Date, lang: Language = "en"): string {
  const locales = {
    en: "en-US",
    id: "id-ID",
    vi: "vi-VN",
    ar: "ar-SA"
  };

  return new Intl.DateTimeFormat(locales[lang], {
    year: "numeric",
    month: "long", 
    day: "numeric"
  }).format(date);
}