import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563eb' },
        background: '#f8fafc',
        card: '#ffffff',
        border: '#e2e8f0',
        foreground: '#0f172a',
        'foreground-secondary': '#475569',
        
        'status-inbox': '#6b7280',
        'status-active': '#3b82f6',
        'status-completed': '#22c55e',
        'status-waiting': '#eab308',
        'status-someday': '#a855f7',
        
        'priority-low': '#94a3b8',
        'priority-medium': '#eab308',
        'priority-high': '#ef4444',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-background',
    'text-foreground',
    'border-border',
    {
      pattern: /bg-(status|priority)-(inbox|active|completed|waiting|someday|low|medium|high)/,
    },
  ],
}
export default config
