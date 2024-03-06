-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 06 Mar 2024 pada 08.57
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `projectkp`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `barang`
--

CREATE TABLE `barang` (
  `material_master` varchar(100) NOT NULL,
  `id_jenis` int(11) DEFAULT NULL,
  `id_kategori` int(11) DEFAULT NULL,
  `id_uom` int(11) DEFAULT NULL,
  `id_mrp` int(11) DEFAULT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `ket` varchar(100) DEFAULT NULL,
  `on_hand` int(11) DEFAULT NULL,
  `on_proccess` int(11) DEFAULT NULL,
  `on_po` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `barang`
--

INSERT INTO `barang` (`material_master`, `id_jenis`, `id_kategori`, `id_uom`, `id_mrp`, `deskripsi`, `harga`, `ket`, `on_hand`, `on_proccess`, `on_po`, `created_at`, `updated_at`) VALUES
('321-107-0097', 27, 28, 28, 32, 'FILTER,PRESSURE LINE:PI4208-13+PI3108 SM', 1000000, 'Thrust roller', 0, 0, 10, '2024-03-04 10:55:14', '2024-03-04 10:55:14'),
('SI00004873', 26, 27, 27, 31, 'OIL,ENCLOSED GEAR:MINERAL;VG 320;OEM', 31600, 'Penggantian Oli Gearbox', 1200, 0, 46100, '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
('SI00012313', 26, 26, 26, 30, 'WELDING ROD:3.2MM; E7018;SMAW;FM', 24750, 'Pemeliharaan Coal Mixing', 960, 1270, 0, '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
('SI00013365', 26, 26, 26, 30, 'WELDING ROD:3.2MM;E6013;SMAW;FM', 28000, 'Pemeliharaan Coal Mixing', 460, 0, 120, '2024-03-04 04:06:10', '2024-03-04 04:06:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `detailpermintaan`
--

CREATE TABLE `detailpermintaan` (
  `tahun` year(4) NOT NULL,
  `material_master` varchar(100) NOT NULL,
  `id_unit` int(11) NOT NULL,
  `jan` int(11) DEFAULT NULL,
  `feb` int(11) DEFAULT NULL,
  `mar` int(11) DEFAULT NULL,
  `apr` int(11) DEFAULT NULL,
  `mei` int(11) DEFAULT NULL,
  `jun` int(11) DEFAULT NULL,
  `jul` int(11) DEFAULT NULL,
  `aug` int(11) DEFAULT NULL,
  `sep` int(11) DEFAULT NULL,
  `oct` int(11) DEFAULT NULL,
  `nov` int(11) DEFAULT NULL,
  `des` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detailpermintaan`
--

INSERT INTO `detailpermintaan` (`tahun`, `material_master`, `id_unit`, `jan`, `feb`, `mar`, `apr`, `mei`, `jun`, `jul`, `aug`, `sep`, `oct`, `nov`, `des`, `created_at`, `updated_at`) VALUES
('2024', '321-107-0097', 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2024-03-06 07:25:49', '2024-03-06 07:25:49'),
('2024', '321-107-0097', 28, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
('2024', 'SI00004873', 26, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, 200, 0, '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
('2024', 'SI00012313', 26, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
('2024', 'SI00013365', 26, 20, 20, 20, 20, 30, 20, 20, 20, 20, 20, 20, 20, '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
('2024', 'SI00013365', 27, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, '2024-03-04 04:06:10', '2024-03-04 04:06:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jenis`
--

CREATE TABLE `jenis` (
  `id_jenis` int(11) NOT NULL,
  `jenis` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jenis`
--

INSERT INTO `jenis` (`id_jenis`, `jenis`, `created_at`, `updated_at`) VALUES
(26, 'CONSUMABLE', '2024-03-04 04:03:06', '2024-03-04 04:03:06'),
(27, 'SPARE PART', '2024-03-04 04:03:06', '2024-03-04 04:03:06');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `kategori` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `kategori`, `created_at`, `updated_at`) VALUES
(26, 'Welding Rod', '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
(27, 'Pelumas', '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
(28, 'Oil Filter', '2024-03-04 04:06:10', '2024-03-04 04:06:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `mrp`
--

CREATE TABLE `mrp` (
  `id_mrp` int(11) NOT NULL,
  `mrp` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `mrp`
--

INSERT INTO `mrp` (`id_mrp`, `mrp`, `created_at`, `updated_at`) VALUES
(30, 'V1', '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
(31, 'ND', '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
(32, 'PD', '2024-03-04 04:06:10', '2024-03-04 04:06:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `plant`
--

CREATE TABLE `plant` (
  `id_plant` int(11) NOT NULL,
  `plant` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `plant`
--

INSERT INTO `plant` (`id_plant`, `plant`, `created_at`, `updated_at`) VALUES
(1, 'Indarung 5', '2024-03-04 23:37:08', '2024-03-04 23:37:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `unit`
--

CREATE TABLE `unit` (
  `id_unit` int(11) NOT NULL,
  `unit` varchar(100) DEFAULT NULL,
  `id_plant` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `unit`
--

INSERT INTO `unit` (`id_unit`, `unit`, `id_plant`, `created_at`, `updated_at`) VALUES
(26, 'Coal Mixing', 1, '2024-03-04 23:37:18', '2024-03-04 23:37:18'),
(27, 'PPTB', NULL, '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
(28, 'KCM 5', NULL, '2024-03-04 04:06:10', '2024-03-04 04:06:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `uom`
--

CREATE TABLE `uom` (
  `id_uom` int(11) NOT NULL,
  `uom` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `uom`
--

INSERT INTO `uom` (`id_uom`, `uom`, `created_at`, `updated_at`) VALUES
(26, 'KG', '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
(27, 'L', '2024-03-04 04:06:10', '2024-03-04 04:06:10'),
(28, 'EA', '2024-03-04 04:06:10', '2024-03-04 04:06:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `isadmin` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `username`, `password`, `isadmin`, `created_at`, `updated_at`) VALUES
(12, 'gilang', 'gilang', 1, '2024-03-04 04:14:34', '2024-03-04 04:14:34');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`material_master`),
  ADD KEY `id_jenis` (`id_jenis`),
  ADD KEY `id_kategori` (`id_kategori`),
  ADD KEY `id_uom` (`id_uom`),
  ADD KEY `id_mrp` (`id_mrp`);

--
-- Indeks untuk tabel `detailpermintaan`
--
ALTER TABLE `detailpermintaan`
  ADD PRIMARY KEY (`tahun`,`material_master`,`id_unit`),
  ADD KEY `material_master` (`material_master`),
  ADD KEY `id_unit` (`id_unit`);

--
-- Indeks untuk tabel `jenis`
--
ALTER TABLE `jenis`
  ADD PRIMARY KEY (`id_jenis`);

--
-- Indeks untuk tabel `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indeks untuk tabel `mrp`
--
ALTER TABLE `mrp`
  ADD PRIMARY KEY (`id_mrp`);

--
-- Indeks untuk tabel `plant`
--
ALTER TABLE `plant`
  ADD PRIMARY KEY (`id_plant`);

--
-- Indeks untuk tabel `unit`
--
ALTER TABLE `unit`
  ADD PRIMARY KEY (`id_unit`),
  ADD KEY `id_plant` (`id_plant`);

--
-- Indeks untuk tabel `uom`
--
ALTER TABLE `uom`
  ADD PRIMARY KEY (`id_uom`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `jenis`
--
ALTER TABLE `jenis`
  MODIFY `id_jenis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT untuk tabel `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT untuk tabel `mrp`
--
ALTER TABLE `mrp`
  MODIFY `id_mrp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT untuk tabel `plant`
--
ALTER TABLE `plant`
  MODIFY `id_plant` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `unit`
--
ALTER TABLE `unit`
  MODIFY `id_unit` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `uom`
--
ALTER TABLE `uom`
  MODIFY `id_uom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `barang_ibfk_1` FOREIGN KEY (`id_jenis`) REFERENCES `jenis` (`id_jenis`),
  ADD CONSTRAINT `barang_ibfk_2` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`),
  ADD CONSTRAINT `barang_ibfk_3` FOREIGN KEY (`id_uom`) REFERENCES `uom` (`id_uom`),
  ADD CONSTRAINT `barang_ibfk_4` FOREIGN KEY (`id_mrp`) REFERENCES `mrp` (`id_mrp`);

--
-- Ketidakleluasaan untuk tabel `detailpermintaan`
--
ALTER TABLE `detailpermintaan`
  ADD CONSTRAINT `detailpermintaan_ibfk_1` FOREIGN KEY (`material_master`) REFERENCES `barang` (`material_master`),
  ADD CONSTRAINT `detailpermintaan_ibfk_2` FOREIGN KEY (`id_unit`) REFERENCES `unit` (`id_unit`);

--
-- Ketidakleluasaan untuk tabel `unit`
--
ALTER TABLE `unit`
  ADD CONSTRAINT `unit_ibfk_1` FOREIGN KEY (`id_plant`) REFERENCES `plant` (`id_plant`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
