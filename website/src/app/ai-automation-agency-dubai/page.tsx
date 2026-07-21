import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DubaiLanding from '../../components/DubaiLanding';
import { getService } from '../../lib/services-content';
import { serviceMetadata } from '../../lib/seo';

const SLUG = 'ai-automation-agency-dubai';
const data = getService(SLUG);

export const metadata: Metadata = serviceMetadata(SLUG);

export default function Page() {
  if (!data) notFound();
  return <DubaiLanding data={data} />;
}
