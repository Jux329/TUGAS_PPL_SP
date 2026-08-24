<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Profil Saya | NTT Culinary's</title>
	@vite('resources/css/app.css')
</head>
<body class="min-h-screen bg-gray-50 text-gray-900">
	<div class="min-h-screen">
		<x-navbar></x-navbar>

		<main class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
			<div class="mb-8">
				<a href="{{ route('menu') }}" class="text-sm font-medium text-orange-600 hover:text-orange-700">&larr; Kembali ke menu</a>
				<h1 class="mt-5 text-3xl font-bold tracking-tight text-gray-900">Informasi akun</h1>
				<p class="mt-2 text-sm text-gray-500">Kelola dan lihat informasi akun kamu di NTT Culinary's.</p>
			</div>

			<section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
				<div class="flex flex-col gap-5 border-b border-gray-100 px-6 py-6 sm:flex-row sm:items-center sm:px-8">
					@if (Auth::user()->avatar)
						<img src="{{ asset('storage/' . Auth::user()->avatar) }}" alt="Foto profil {{ Auth::user()->name }}" class="size-20 shrink-0 rounded-full object-cover ring-4 ring-orange-50">
					@else
						<div class="flex size-20 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600">
							{{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
						</div>
					@endif
					<div class="min-w-0">
						<h2 class="truncate text-xl font-semibold text-gray-900">{{ Auth::user()->name }}</h2>
						<p class="truncate text-sm text-gray-500">{{ Auth::user()->email }}</p>
						<form method="POST" action="{{ route('usersetting.avatar') }}" enctype="multipart/form-data" class="mt-3 flex flex-wrap items-center gap-3">
							@csrf
							<label for="avatar" class="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-600">Pilih foto</label>
							<input id="avatar" name="avatar" type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" required>
							<button type="submit" class="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100">Simpan foto</button>
						</form>
						<p class="mt-2 text-xs text-gray-400">JPG, PNG, atau WEBP. Maksimal 2 MB.</p>
						@error('avatar')<p class="mt-2 text-sm text-red-600">{{ $message }}</p>@enderror
						@if (session('status'))<p class="mt-2 text-sm font-medium text-green-600">{{ session('status') }}</p>@endif
					</div>
				</div>

				<dl class="divide-y divide-gray-100">
					<div class="grid gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4 sm:px-8">
						<dt class="text-sm font-medium text-gray-500">Nama lengkap</dt>
						<dd class="text-sm text-gray-900 sm:col-span-2">{{ Auth::user()->name }}</dd>
					</div>
					<div class="grid gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4 sm:px-8">
						<dt class="text-sm font-medium text-gray-500">Alamat email</dt>
						<dd class="break-all text-sm text-gray-900 sm:col-span-2">{{ Auth::user()->email }}</dd>
					</div>
					<div class="grid gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4 sm:px-8">
						<dt class="text-sm font-medium text-gray-500">ID akun</dt>
						<dd class="text-sm text-gray-900 sm:col-span-2">#{{ Auth::user()->id }}</dd>
					</div>
					<div class="grid gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4 sm:px-8">
						<dt class="text-sm font-medium text-gray-500">Status email</dt>
						<dd class="text-sm sm:col-span-2">
							@if (Auth::user()->email_verified_at)
								<span class="font-medium text-green-600">Terverifikasi</span>
							@else
								<span class="font-medium text-gray-500">Belum diverifikasi</span>
							@endif
						</dd>
					</div>
					<div class="grid gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4 sm:px-8">
						<dt class="text-sm font-medium text-gray-500">Bergabung sejak</dt>
						<dd class="text-sm text-gray-900 sm:col-span-2">{{ Auth::user()->created_at?->format('d F Y') ?? '-' }}</dd>
					</div>
				</dl>

				<div class="border-t border-gray-100 bg-gray-50 px-6 py-5 sm:px-8">
					<form method="POST" action="{{ route('logout') }}">
						@csrf
						<button type="submit" class="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100">Log out</button>
					</form>
				</div>
			</section>
		</main>
	</div>
</body>
</html>
