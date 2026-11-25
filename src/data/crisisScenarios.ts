import { CrisisScenario } from '../types/crisis';

export const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: 'produk-kemasan',
    title: 'Isu Segel Kemasan Produk Viral',
    category: 'Kualitas Produk & Keamanan',
    detectedAt: '14:12 WIB',
    overallNegativePct: 82,
    totalMentions: 18420,
    summary:
      'Video keluhan segel kemasan rusak memicu lonjakan sebutan negatif lintas kanal dalam 45 menit terakhir.',
    channels: [
      {
        channel: 'TikTok',
        negativePercentage: 88,
        mentionsCount: 9840,
        velocityPerHour: '+2.400/jam',
        trendingTag: '#CekSegelProduk',
        radarAngleDeg: 38,
        radarDistanceRatio: 0.28,
        sampleAuthor: '@nadia.ulasan',
        samplePost:
          'Baru buka paket tapi segel botolnya kelihatan longgar dan isinya merembes. Sudah 3 orang di kolom komentar ngalamin hal sama.',
        sampleTime: '12 menit lalu',
        reachEstimate: '410K tayangan',
      },
      {
        channel: 'X',
        negativePercentage: 79,
        mentionsCount: 5390,
        velocityPerHour: '+1.180/jam',
        trendingTag: 'Boikot Batch 04',
        radarAngleDeg: 145,
        radarDistanceRatio: 0.42,
        sampleAuthor: '@rahmat_kritis',
        samplePost:
          'Tolong klarifikasi resmi untuk produksi batch 04. Jangan diam saja saat konsumen ramai mempertanyakan standar QC.',
        sampleTime: '19 menit lalu',
        reachEstimate: '185K impresi',
      },
      {
        channel: 'Instagram',
        negativePercentage: 71,
        mentionsCount: 3190,
        velocityPerHour: '+640/jam',
        trendingTag: '#KlarifikasiSegel',
        radarAngleDeg: 262,
        radarDistanceRatio: 0.56,
        sampleAuthor: '@komunitas.konsumen',
        samplePost:
          'Kami menghimpun laporan pembeli terkait kemasan minggu ini. Menunggu tanggapan resmi dari tim Humas.',
        sampleTime: '27 menit lalu',
        reachEstimate: '92K jangkauan',
      },
    ],
    teamMembers: [
      {
        id: 'tm-1',
        name: 'Rani Prameswari',
        role: 'Kepala Humas & Juru Bicara',
        unit: 'Corporate Comm',
        acknowledged: false,
      },
      {
        id: 'tm-2',
        name: 'Dimas Hartono',
        role: 'Manajer Kendali Mutu',
        unit: 'Quality Assurance',
        acknowledged: false,
      },
      {
        id: 'tm-3',
        name: 'Siti Nurhaliza',
        role: 'Penasihat Hukum Korporat',
        unit: 'Legal & Compliance',
        acknowledged: false,
      },
      {
        id: 'tm-4',
        name: 'Bima Putra',
        role: 'Lead Media Sosial',
        unit: 'Digital PR',
        acknowledged: false,
      },
      {
        id: 'tm-5',
        name: 'Ayu Lestari',
        role: 'Koordinator Layanan Pelanggan',
        unit: 'Customer Care',
        acknowledged: false,
      },
    ],
    scheduledPosts: [
      {
        id: 'sp-1',
        channel: 'Instagram',
        title: 'Reels Promo Akhir Bulan & Giveaway',
        scheduledAt: 'Hari ini · 16:00 WIB',
      },
      {
        id: 'sp-2',
        channel: 'TikTok',
        title: 'Video BTS Tim Kreatif Studio',
        scheduledAt: 'Hari ini · 18:30 WIB',
      },
      {
        id: 'sp-3',
        channel: 'X',
        title: 'Utas Tips Gaya Hidup Mingguan',
        scheduledAt: 'Besok · 09:00 WIB',
      },
      {
        id: 'sp-4',
        channel: 'Instagram',
        title: 'Carousel Testimoni Pelanggan',
        scheduledAt: 'Besok · 12:00 WIB',
      },
    ],
    templates: [
      {
        id: 'tpl-investigasi',
        label: 'Klarifikasi & Investigasi Cepat',
        content:
          'Kami memahami kekhawatiran masyarakat terkait video kemasan produk batch tertentu yang beredar hari ini. Tim Kendali Mutu kami telah melakukan audit langsung di lini distribusi dan membuka jalur penukaran gratis tanpa syarat melalui layanan resmi kami. Pembaruan hasil pemeriksaan akan kami sampaikan secara terbuka dalam 6 jam ke depan.',
      },
      {
        id: 'tpl-fakta',
        label: 'Penegasan Standar Keamanan',
        content:
          'Menanggapi unggahan mengenai segel kemasan, kami memastikan seluruh produk melewati uji sterilitas berlapis sebelum keluar dari pabrik. Untuk unit dengan kerusakan distribusi pada batch terkait, silakan kirimkan foto kode produksi ke layanan resmi kami untuk penggantian segera.',
      },
    ],
    recoveryTimeline: {
      beforePublish: [
        { timeLabel: '12:00', positiveScore: 76, negativeScore: 12, phase: 'baseline' },
        { timeLabel: '13:00', positiveScore: 71, negativeScore: 18, phase: 'baseline' },
        { timeLabel: '13:30', positiveScore: 42, negativeScore: 49, phase: 'crisis' },
        { timeLabel: '14:00', positiveScore: 18, negativeScore: 78, phase: 'crisis' },
        { timeLabel: '14:15', positiveScore: 14, negativeScore: 82, phase: 'crisis' },
      ],
      afterPublish: [
        { timeLabel: '14:30', positiveScore: 28, negativeScore: 64, phase: 'clarification' },
        { timeLabel: '15:30', positiveScore: 51, negativeScore: 39, phase: 'recovery' },
        { timeLabel: '17:00', positiveScore: 69, negativeScore: 22, phase: 'recovery' },
        { timeLabel: '19:00', positiveScore: 78, negativeScore: 14, phase: 'recovery' },
      ],
    },
  },
  {
    id: 'gangguan-sistem',
    title: 'Gangguan Aplikasi & Saldo Tertahan',
    category: 'Layanan Digital & Transaksi',
    detectedAt: '09:40 WIB',
    overallNegativePct: 86,
    totalMentions: 24650,
    summary:
      'Lonjakan keluhan transaksi gagal dan saldo terpotong setelah pembaruan server pagi ini memicu trending di X.',
    channels: [
      {
        channel: 'X',
        negativePercentage: 91,
        mentionsCount: 14320,
        velocityPerHour: '+3.800/jam',
        trendingTag: '#AplikasiError',
        radarAngleDeg: 52,
        radarDistanceRatio: 0.24,
        sampleAuthor: '@fajar_tech',
        samplePost:
          'Transfer sudah sukses di mutasi tapi penerima belum terima dana selama 2 jam. CS juga belum merespons.',
        sampleTime: '8 menit lalu',
        reachEstimate: '620K impresi',
      },
      {
        channel: 'Instagram',
        negativePercentage: 82,
        mentionsCount: 6210,
        velocityPerHour: '+1.450/jam',
        trendingTag: '#SaldoTertahan',
        radarAngleDeg: 170,
        radarDistanceRatio: 0.36,
        sampleAuthor: '@merchant.jkt',
        samplePost:
          'Kolom komentar akun resmi penuh keluhan merchant yang tidak bisa mencairkan dana operasional hari ini.',
        sampleTime: '15 menit lalu',
        reachEstimate: '215K jangkauan',
      },
      {
        channel: 'TikTok',
        negativePercentage: 76,
        mentionsCount: 4120,
        velocityPerHour: '+890/jam',
        trendingTag: '#MaintenanceDadakan',
        radarAngleDeg: 295,
        radarDistanceRatio: 0.48,
        sampleAuthor: '@ulasan.dompet',
        samplePost:
          'Jangan transaksi dulu pagi ini sampai ada pengumuman resmi pemulihan jaringan dari pihak pengelola.',
        sampleTime: '22 menit lalu',
        reachEstimate: '175K tayangan',
      },
    ],
    teamMembers: [
      {
        id: 'tm-1',
        name: 'Rani Prameswari',
        role: 'Kepala Humas & Juru Bicara',
        unit: 'Corporate Comm',
        acknowledged: false,
      },
      {
        id: 'tm-2',
        name: 'Hendra Wijaya',
        role: 'VP Infrastruktur Teknologi',
        unit: 'Engineering',
        acknowledged: false,
      },
      {
        id: 'tm-3',
        name: 'Siti Nurhaliza',
        role: 'Penasihat Hukum Korporat',
        unit: 'Legal & Compliance',
        acknowledged: false,
      },
      {
        id: 'tm-4',
        name: 'Bima Putra',
        role: 'Lead Media Sosial',
        unit: 'Digital PR',
        acknowledged: false,
      },
    ],
    scheduledPosts: [
      {
        id: 'sp-1',
        channel: 'X',
        title: 'Promo Cashback Pembayaran Tagihan',
        scheduledAt: 'Hari ini · 11:00 WIB',
      },
      {
        id: 'sp-2',
        channel: 'Instagram',
        title: 'Infografis Fitur Investasi Baru',
        scheduledAt: 'Hari ini · 14:00 WIB',
      },
      {
        id: 'sp-3',
        channel: 'TikTok',
        title: 'Konten Edukasi Finansial Gen-Z',
        scheduledAt: 'Hari ini · 17:00 WIB',
      },
    ],
    templates: [
      {
        id: 'tpl-pemulihan',
        label: 'Pembaruan Pemulihan Sistem',
        content:
          'Kami memohon maaf atas kendala akses transaksi yang terjadi sejak pukul 09.15 WIB. Tim teknis kami sedang melakukan sinkronisasi sistem dan menjamin seluruh dana pengguna tetap aman. Pengembalian dana otomatis untuk transaksi tertunda diproses bertahap dalam 2x24 jam.',
      },
      {
        id: 'tpl-stabil',
        label: 'Konfirmasi Sistem Stabil',
        content:
          'Layanan transaksi utama kini berangsur pulih. Bagi pengguna yang masih mengalami saldo tertahan, sistem rekonsiliasi otomatis sedang berjalan tanpa perlu pengajuan ulang tiket.',
      },
    ],
    recoveryTimeline: {
      beforePublish: [
        { timeLabel: '08:00', positiveScore: 81, negativeScore: 9, phase: 'baseline' },
        { timeLabel: '08:45', positiveScore: 74, negativeScore: 16, phase: 'baseline' },
        { timeLabel: '09:15', positiveScore: 31, negativeScore: 61, phase: 'crisis' },
        { timeLabel: '09:30', positiveScore: 15, negativeScore: 81, phase: 'crisis' },
        { timeLabel: '09:40', positiveScore: 11, negativeScore: 86, phase: 'crisis' },
      ],
      afterPublish: [
        { timeLabel: '10:00', positiveScore: 32, negativeScore: 59, phase: 'clarification' },
        { timeLabel: '11:00', positiveScore: 56, negativeScore: 34, phase: 'recovery' },
        { timeLabel: '12:30', positiveScore: 72, negativeScore: 19, phase: 'recovery' },
        { timeLabel: '14:00', positiveScore: 80, negativeScore: 11, phase: 'recovery' },
      ],
    },
  },
];
