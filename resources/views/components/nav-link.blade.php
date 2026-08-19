 @props(['active' => false])
 
 <a {{ $attributes }}
 class="{{ $active ? 'rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white' : 'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white'}}" aria-current="{{ $active ? 'page' : false }}">{{ $slot }}</a>
 <!-- di sini kita menggunakan atrribute dan untuk mengirim posisi aktif ke link di navbar, jadi hati2 jangan sembarang di ubah ---