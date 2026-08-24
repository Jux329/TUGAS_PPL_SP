<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Masuk | NTT Culinary's</title>
	@vite('resources/css/app.css')
</head>
<body class="min-h-screen bg-white text-gray-900">
	<main class="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
		<div class="w-full max-w-md">
			<div class="mb-8 text-center">
				<a href="{{ route('menu') }}" class="text-2xl font-bold tracking-tight text-orange-600">NTT Culinary's</a>
				<h1 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">Selamat datang kembali</h1>
				<p class="mt-2 text-sm text-gray-500">Masuk untuk melanjutkan pesanan kuliner favoritmu.</p>
			</div>

			<form method="POST" action="{{ route('login.store') }}" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
				@csrf

				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
					<input id="email" name="email" type="email" value="{{ old('email') }}" required autofocus autocomplete="email" class="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100" placeholder="nama@email.com">
					@error('email')<p class="mt-2 text-sm text-red-600">{{ $message }}</p>@enderror
				</div>

				<div class="mt-5">
					<div class="flex items-center justify-between">
						<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
						<span class="text-xs text-gray-400">Minimal 8 karakter</span>
					</div>
					<input id="password" name="password" type="password" required autocomplete="current-password" class="mt-2 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100" placeholder="Masukkan password">
				</div>

				<label class="mt-5 flex items-center gap-2 text-sm text-gray-600">
					<input name="remember" type="checkbox" class="size-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500">
					Ingat saya
				</label>

				<button type="submit" class="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100">Masuk</button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-500">Belum punya akun? <a href="{{ route('register') }}" class="font-semibold text-orange-600 hover:text-orange-700">Daftar sekarang</a></p>
		</div>
	</main>
</body>
</html>
