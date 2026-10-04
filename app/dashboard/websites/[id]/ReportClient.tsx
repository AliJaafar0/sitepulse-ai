'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Trash2,
  Clock,
  FileWarning,
  CheckCircle2,
} from 'lucide-react';
import { ScoreRing } from '@/components/ScoreRing';
import { ScoreBars } from '@/components/ScoreBars';
import { formatDate } from '@/lib/utils';
import { ScoreChart } from '@/components/ScoreChart';

export default function ReportClient({ website }: { website: any }) {
  const [site, setSite] = useState(website);
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState<any>(null);

  const scans = Array.isArray(site?.scans) ? site.scans : [];
  const latest = scans[0];

  const history = useMemo(
    () =>
      [...scans].reverse().map((s: any) => ({
        date: formatDate(s?.createdAt),
        score: s?.score ?? 0,
      })),
    [scans]
  );

  async function scan() {
    setBusy(true);
    setAi(null);

    try {
      const r = await fetch(`/api/websites/${site.id}/scan`, {
        method: 'POST',
      });

      const d = await r.json();

      if (r.ok) {
        const rawScan = d?.scan || d;

        const newScan = {
          ...rawScan,
          createdAt: rawScan?.createdAt || new Date().toISOString(),
          findings: Array.isArray(rawScan?.findings)
            ? rawScan.findings
            : [],
        };

        setSite((x: any) => ({
          ...x,
          scans: [newScan, ...(Array.isArray(x?.scans) ? x.scans : [])],
        }));
      } else {
        alert(d?.error || 'Scan failed');
      }
    } catch (error) {
      console.error('Scan error:', error);
      alert('Unable to run scan');
    } finally {
      setBusy(false);
    }
  }

  async function insight() {
    if (!latest) return;

    setAi({ loading: true });

    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          scanId: latest.id,
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        alert(data?.error || 'Failed to generate AI insights');
        setAi(null);
        return;
      }

      setAi({
        ...data,
        loading: false,
      });
    } catch (error) {
      console.error('AI insight error:', error);
      alert('Network error while fetching AI insights');
      setAi(null);
    }
  }

  async function remove() {
    if (!confirm('Delete this monitor and its scan history?')) {
      return;
    }

    try {
      await fetch(`/api/websites/${site.id}`, {
        method: 'DELETE',
      });

      location.href = '/dashboard';
    } catch (error) {
      console.error('Delete error:', error);
      alert('Unable to delete this monitor');
    }
  }

  const findings = Array.isArray(latest?.findings)
    ? latest.findings
    : [];

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500"
      >
        <ArrowLeft size={16} />
        Dashboard
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold text-[#6d5dfc]">
            Website report
          </p>

          <h1 className="mt-1 text-3xl font-black">
            {site?.name}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {site?.url}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={remove}
            className="btn btn-soft text-red-600"
          >
            <Trash2 size={17} />
          </button>

          <button
            onClick={scan}
            disabled={busy}
            className="btn btn-primary"
          >
            <RefreshCw
              size={17}
              className={busy ? 'animate-spin' : ''}
            />

            {busy ? 'Scanning…' : 'Run scan'}
          </button>
        </div>
      </div>

      {!latest ? (
        <div className="card mt-8 p-10 text-center">
          <h2 className="text-xl font-black">
            No scan yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Run the first scan to generate the health report.
          </p>

          <button
            onClick={scan}
            disabled={busy}
            className="btn btn-primary mt-6"
          >
            {busy ? 'Scanning…' : 'Run first scan'}
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="card flex items-center gap-6 p-7">
              <ScoreRing
                score={latest?.score ?? 0}
                size={130}
              />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Health score
                </p>

                <p className="mt-2 text-2xl font-black">
                  {(latest?.score ?? 0) >= 90
                    ? 'Excellent'
                    : (latest?.score ?? 0) >= 75
                    ? 'Good'
                    : (latest?.score ?? 0) >= 60
                    ? 'Needs work'
                    : 'Critical'}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Updated {formatDate(latest?.createdAt)}
                </p>
              </div>
            </div>

            <div className="card p-7 lg:col-span-2">
              <ScoreBars
                items={[
                  {
                    label: 'Performance',
                    value: latest?.performance ?? 100,
                  },
                  {
                    label: 'SEO',
                    value: latest?.seo ?? 100,
                  },
                  {
                    label: 'Accessibility',
                    value: latest?.accessibility ?? 100,
                  },
                  {
                    label: 'Security',
                    value: latest?.security ?? 100,
                  },
                ]}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-5">
            <div className="card p-6 lg:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-black">
                    Latest findings
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Actionable signals from the last scan.
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">
                  {findings.length} findings
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {findings.length > 0 ? (
                  findings.map((f: any, i: number) => (
                    <Finding
                      key={f?.id || i}
                      f={f}
                    />
                  ))
                ) : (
                  <div className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    No issues were detected by the current checks.
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-black">
                    AI action plan
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Turn findings into next steps.
                  </p>
                </div>

                <Sparkles
                  size={18}
                  className="text-[#6d5dfc]"
                />
              </div>

              {!ai ? (
                <button
                  onClick={insight}
                  className="btn btn-soft mt-6 w-full"
                >
                  Generate insights
                </button>
              ) : ai.loading ? (
                <p className="mt-6 text-sm text-gray-500">
                  Analyzing your report…
                </p>
              ) : (
                <>
                  <p className="mt-6 text-sm leading-6 text-gray-600">
                    {ai?.summary}
                  </p>

                  <ul className="mt-4 space-y-3">
                    {(Array.isArray(ai?.actions)
                      ? ai.actions
                      : []
                    ).map((a: string, i: number) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm"
                      >
                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-[#6d5dfc]"
                        />

                        {a}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="card mt-5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black">
                  Health trend
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Score movement across completed scans.
                </p>
              </div>

              <Clock size={18} />
            </div>

            <ScoreChart data={history} />

            <div className="mt-5 overflow-x-auto">
              <h3 className="mb-3 font-black">
                Scan history
              </h3>

              <table className="w-full min-w-[500px] text-left text-sm">
                <thead className="border-b text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="pb-3">
                      Date
                    </th>

                    <th className="pb-3">
                      Score
                    </th>

                    <th className="pb-3">
                      Response
                    </th>

                    <th className="pb-3">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {scans.map((s: any, i: number) => (
                    <tr
                      key={s?.id || i}
                      className="border-b last:border-0"
                    >
                      <td className="py-4 font-semibold">
                        {formatDate(s?.createdAt)}
                      </td>

                      <td className="py-4 font-black">
                        {s?.score ?? 0}
                      </td>

                      <td className="py-4">
                        {s?.responseMs ?? 120} ms
                      </td>

                      <td className="py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          {s?.status || 'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mt-5 p-6">
            <h2 className="font-black">
              Technical snapshot
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                [
                  'HTTP status',
                  String(latest?.status || '200'),
                ],
                [
                  'Response',
                  `${latest?.responseMs ?? 120} ms`,
                ],
                [
                  'Findings',
                  String(findings.length),
                ],
                [
                  'Scans',
                  String(scans.length),
                ],
              ].map(([a, b]) => (
                <div
                  key={a}
                  className="rounded-xl bg-gray-50 p-4"
                >
                  <p className="text-xs text-gray-400">
                    {a}
                  </p>

                  <p className="mt-2 font-black">
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Finding({ f }: { f: any }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-start gap-3">
        <FileWarning
          size={18}
          className="mt-0.5 text-[#6d5dfc]"
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold">
              {f?.title || 'Website issue'}
            </p>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                f?.severity === 'high'
                  ? 'bg-red-50 text-red-600'
                  : f?.severity === 'medium'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {f?.severity || 'low'}
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            {f?.detail || 'No additional details available.'}
          </p>
        </div>
      </div>
    </div>
  );
}