'use client';
import { useRouter, usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { icon: 'sports_esports', label: 'Games',  path: '/home?tab=games'  },
  { icon: 'apps',           label: 'Apps',   path: '/home'            },
  { icon: 'search',         label: 'Search', path: '/search'          },
  { icon: 'book',           label: 'Books',  path: '/home?tab=books'  },
];

export default function BottomNav({ active = 'Apps' }: { active?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex border-t border-[#E8EAED] bg-white flex-shrink-0">
      {NAV_ITEMS.map(item => {
        const isActive = item.label === active;
        return (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className="flex-1 flex flex-col items-center py-2 pb-3 gap-[3px] border-none bg-transparent cursor-pointer"
          >
            <span
              className="material-icons-round text-[22px]"
              style={{ color: isActive ? '#1A73E8' : '#5F6368' }}
            >
              {item.icon}
            </span>
            <span
              className="text-[11px] tracking-wide"
              style={{ color: isActive ? '#1A73E8' : '#5F6368', fontWeight: isActive ? 500 : 400 }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
