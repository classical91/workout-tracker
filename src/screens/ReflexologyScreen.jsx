import { useState } from "react";
import { T, font } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { ReflexologyChart } from "../components/ReflexologyChart.jsx";
import {
  reflexologyIntro,
  reflexRegions,
  reflexCharts,
  reliefIntro,
  reliefPoints,
  concernColors,
} from "../data/reflexology.js";
import {
  reflexologyWikiIntro,
  reflexologyWikiArticles,
  reflexologyWikiCategories,
} from "../data/reflexologyWiki.js";

const ACCENT = T.teal;

function Toggle({ options, value, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 8 }}>
      {options.map(([key, label]) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              padding: "11px 0",
              minHeight: 44,
              borderRadius: 12,
              border: `1px solid ${active ? ACCENT : T.border}`,
              background: active ? `${ACCENT}1A` : T.surface,
              color: active ? ACCENT : T.muted,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 0.5,
              cursor: "pointer",
              fontFamily: font,
              textAlign: "center",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function NumberBadge({ n, color }) {
  return (
    <span
      style={{
        width: 24,
        height: 24,
        borderRadius: 99,
        background: color,
        color: "#0A0A0C",
        fontSize: 11,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );
}

function ConcernTags({ concerns }) {
  return (
    <span style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {concerns.map((c) => {
        const color = concernColors[c] || ACCENT;
        return (
          <span
            key={c}
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 0.5,
              color,
              background: `${color}1A`,
              borderRadius: 99,
              padding: "2px 8px",
            }}
          >
            {c.toUpperCase()}
          </span>
        );
      })}
    </span>
  );
}

export function ReflexologyScreen({ onBack }) {
  const [mode, setMode] = useState("map");
  const [type, setType] = useState("hand");
  const [side, setSide] = useState("right");
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedArticleKey, setSelectedArticleKey] = useState(null);

  const isWiki = mode === "wiki";
  const isRelief = mode === "relief";
  const zones = isWiki ? [] : isRelief ? reliefPoints : reflexCharts[type][side];
  const selected = isWiki ? null : zones.find((z) => z.key === selectedKey) || null;
  const selectedArticle = selectedArticleKey ? reflexologyWikiArticles[selectedArticleKey] : null;

  const change = (setter) => (value) => {
    setter(value);
    setSelectedKey(null);
  };
  const changeMode = (value) => {
    setMode(value);
    setSelectedKey(null);
    if (value !== "wiki") setSelectedArticleKey(null);
  };

  const partLabel = `${side === "left" ? "Left" : "Right"} ${type === "hand" ? "Hand" : "Foot"}`;
  const viewLabel = type === "hand" ? "palm up" : "sole up";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: font,
        color: T.text,
        paddingBottom: 60,
      }}
    >
      <ScreenHeader
        title="Reflexology"
        subtitle="HANDS · FEET · PRESSURE MAP"
        emoji="🖐️"
        color={ACCENT}
        onBack={onBack}
      />

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: 12 }}>
          <Toggle
            options={[
              ["map", "🗺️ Organ Map"],
              ["relief", "🎯 Relief Points"],
              ["wiki", "📚 Wiki"],
            ]}
            value={mode}
            onChange={changeMode}
          />
        </div>

        <div
          style={{
            background: `${ACCENT}12`,
            border: `1px solid ${ACCENT}35`,
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 16,
            fontSize: 12,
            color: T.text,
            lineHeight: 1.6,
          }}
        >
          {isWiki ? reflexologyWikiIntro : isRelief ? reliefIntro : reflexologyIntro}
        </div>

        {mode === "map" && (
          <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
            <Toggle
              options={[
                ["hand", "🖐️ Hands"],
                ["foot", "🦶 Feet"],
              ]}
              value={type}
              onChange={change(setType)}
            />
            <Toggle
              options={[
                ["right", "Right"],
                ["left", "Left"],
              ]}
              value={side}
              onChange={change(setSide)}
            />
          </div>
        )}

        {isWiki ? (
          <WikiDatabase
            selectedArticle={selectedArticle}
            selectedArticleKey={selectedArticleKey}
            onSelectArticle={setSelectedArticleKey}
            onBackToIndex={() => setSelectedArticleKey(null)}
          />
        ) : (
          <>
            {/* Chart */}
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: "14px 12px 18px",
                marginBottom: 12,
              }}
            >
              <p
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  letterSpacing: 2,
                  color: T.muted,
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                {isRelief
                  ? "HAND & WRIST · PALM UP"
                  : `${partLabel.toUpperCase()} · ${viewLabel.toUpperCase()}`}
              </p>
              <ReflexologyChart
                type={isRelief ? "relief" : type}
                side={isRelief ? undefined : side}
                zones={zones}
                selectedKey={selectedKey}
                onSelect={setSelectedKey}
              />
            </div>

            {/* Selected point detail */}
            {isRelief ? (
              <ReliefDetail selected={selected} zones={zones} />
            ) : (
              <OrganDetail selected={selected} zones={zones} />
            )}

            {/* List */}
            {isRelief ? (
              <ReliefList zones={zones} selectedKey={selectedKey} onSelect={setSelectedKey} />
            ) : (
              <OrganList zones={zones} selectedKey={selectedKey} onSelect={setSelectedKey} />
            )}
          </>
        )}

        <p style={{ fontSize: 11, color: T.dim, lineHeight: 1.6, marginTop: 4 }}>
          Reflexology and acupressure are relaxing complementary practices, not a medical treatment
          or diagnosis. See a healthcare professional for any health concern, avoid pressing injured
          areas, and follow the cautions noted on individual points.
        </p>
      </div>
    </div>
  );
}

// ---------- Wiki database ----------
function WikiDatabase({ selectedArticle, selectedArticleKey, onSelectArticle, onBackToIndex }) {
  if (selectedArticle) {
    return (
      <WikiArticle
        article={selectedArticle}
        articleKey={selectedArticleKey}
        onSelectArticle={onSelectArticle}
        onBackToIndex={onBackToIndex}
      />
    );
  }

  return (
    <div style={{ marginBottom: 22 }}>
      <p
        style={{
          fontSize: 10,
          letterSpacing: 2,
          color: ACCENT,
          fontWeight: 700,
          marginBottom: 10,
          marginTop: 8,
        }}
      >
        REFLEXOLOGY DATABASE
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {reflexologyWikiCategories.map((category) => (
          <WikiCategory
            key={category.key}
            category={category}
            selectedArticleKey={selectedArticleKey}
            onSelectArticle={onSelectArticle}
          />
        ))}
      </div>
    </div>
  );
}

function WikiCategory({ category, selectedArticleKey, onSelectArticle }) {
  return (
    <section
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "14px 14px 12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            background: `${ACCENT}14`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {category.icon}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontWeight: 800, fontSize: 15, marginBottom: 3 }}>
            {category.title}
          </span>
          <span style={{ display: "block", fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
            {category.description}
          </span>
        </span>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        {category.articles.map((articleKey) => {
          const article = reflexologyWikiArticles[articleKey];
          const active = selectedArticleKey === articleKey;
          return (
            <button
              key={articleKey}
              type="button"
              onClick={() => onSelectArticle(articleKey)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                width: "100%",
                border: `1px solid ${active ? ACCENT : T.border}`,
                borderRadius: 10,
                background: active ? `${ACCENT}12` : T.surface2,
                color: T.text,
                padding: "10px 11px",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: font,
              }}
            >
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 13, fontWeight: 700 }}>
                  {article.title}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: 10,
                    color: T.muted,
                    marginTop: 3,
                    lineHeight: 1.35,
                  }}
                >
                  {article.overview}
                </span>
              </span>
              <span style={{ color: ACCENT, fontSize: 16, flexShrink: 0 }}>›</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function WikiArticle({ article, articleKey, onSelectArticle, onBackToIndex }) {
  const relatedArticles = Object.entries(reflexologyWikiArticles).filter(
    ([key, item]) => key !== articleKey && article.related.includes(item.title)
  );

  return (
    <article
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: "16px",
        marginBottom: 22,
      }}
    >
      <button
        type="button"
        onClick={onBackToIndex}
        style={{
          background: "transparent",
          border: 0,
          color: ACCENT,
          cursor: "pointer",
          fontFamily: font,
          fontSize: 12,
          fontWeight: 800,
          padding: 0,
          marginBottom: 14,
        }}
      >
        ← WIKI INDEX
      </button>

      <p
        style={{
          fontSize: 10,
          letterSpacing: 2,
          color: ACCENT,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {article.category.toUpperCase()}
      </p>
      <h2 style={{ fontSize: 24, lineHeight: 1.1, marginBottom: 14 }}>{article.title}</h2>

      <ArticleBlock title="Overview">{article.overview}</ArticleBlock>
      <ArticleBlock title="Location">{article.location}</ArticleBlock>
      <ArticleBlock title="Traditional Use">{article.traditionalUse}</ArticleBlock>
      <ArticleBlock title="How To Apply Gentle Pressure">{article.howToApply}</ArticleBlock>
      <ArticleBlock title="Safety Notes" caution>
        {article.safety}
      </ArticleBlock>

      <div style={{ marginBottom: 14 }}>
        <ArticleHeading>Related Points</ArticleHeading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {article.related.map((item) => {
            const related = relatedArticles.find(([_key, entry]) => entry.title === item);
            return related ? (
              <button
                key={item}
                type="button"
                onClick={() => onSelectArticle(related[0])}
                style={{
                  border: `1px solid ${ACCENT}45`,
                  background: `${ACCENT}10`,
                  color: ACCENT,
                  borderRadius: 99,
                  padding: "6px 9px",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: font,
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ) : (
              <span
                key={item}
                style={{
                  border: `1px solid ${T.border}`,
                  background: T.surface2,
                  color: T.muted,
                  borderRadius: 99,
                  padding: "6px 9px",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>

      <div>
        <ArticleHeading>Sources / References</ArticleHeading>
        <div style={{ display: "grid", gap: 7 }}>
          {article.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              style={{
                color: T.muted,
                background: T.surface2,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "9px 10px",
                fontSize: 11,
                lineHeight: 1.4,
                textDecoration: "none",
                wordBreak: "break-word",
              }}
            >
              {source.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function ArticleBlock({ title, children, caution = false }) {
  return (
    <section
      style={{
        background: caution ? `${T.red}10` : "transparent",
        borderLeft: `3px solid ${caution ? T.red : ACCENT}`,
        borderRadius: 6,
        padding: "2px 0 2px 10px",
        marginBottom: 14,
      }}
    >
      <ArticleHeading color={caution ? T.red : ACCENT}>{title}</ArticleHeading>
      <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{children}</p>
    </section>
  );
}

function ArticleHeading({ children, color = ACCENT }) {
  return (
    <span
      style={{
        display: "block",
        fontSize: 10,
        color,
        fontWeight: 800,
        letterSpacing: 1,
        marginBottom: 5,
      }}
    >
      {children.toUpperCase()}
    </span>
  );
}

// ---------- Organ map detail + list ----------
function OrganDetail({ selected, zones }) {
  const color = selected ? reflexRegions[selected.region].color : T.border;
  return (
    <div
      style={{
        background: selected ? `${color}10` : T.surface,
        border: `1px solid ${selected ? color + "50" : T.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 20,
        minHeight: 64,
      }}
    >
      {selected ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <NumberBadge n={zones.indexOf(selected) + 1} color={color} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{selected.name}</span>
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              color,
              marginBottom: 6,
            }}
          >
            {selected.area.toUpperCase()}
          </div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{selected.benefit}</div>
        </>
      ) : (
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
          Tap a numbered point on the chart, or pick one from the list below, to see what it maps
          to.
        </div>
      )}
    </div>
  );
}

function OrganList({ zones, selectedKey, onSelect }) {
  return Object.entries(reflexRegions).map(([regionKey, region]) => {
    const items = zones.filter((z) => z.region === regionKey);
    if (items.length === 0) return null;
    return (
      <div key={regionKey} style={{ marginBottom: 18 }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: 2,
            color: region.color,
            fontWeight: 700,
            marginBottom: 10,
            marginTop: 8,
          }}
        >
          {region.label.toUpperCase()}
        </p>
        {items.map((zone) => {
          const active = zone.key === selectedKey;
          return (
            <ListRow
              key={zone.key}
              active={active}
              color={region.color}
              n={zones.indexOf(zone) + 1}
              title={zone.name}
              subtitle={zone.area}
              onClick={() => onSelect(active ? null : zone.key)}
            />
          );
        })}
      </div>
    );
  });
}

// ---------- Relief points detail + list ----------
function ReliefDetail({ selected, zones }) {
  const color = selected ? selected.color : T.border;
  return (
    <div
      style={{
        background: selected ? `${color}10` : T.surface,
        border: `1px solid ${selected ? color + "50" : T.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 20,
        minHeight: 64,
      }}
    >
      {selected ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <NumberBadge n={zones.indexOf(selected) + 1} color={color} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{selected.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 0.5 }}>
              {selected.code}
            </span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <ConcernTags concerns={selected.concerns} />
          </div>
          {[
            ["WHERE", selected.location],
            ["HOW TO PRESS", selected.howto],
          ].map(([heading, text]) => (
            <div key={heading} style={{ marginBottom: 8 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 10,
                  color,
                  fontWeight: 700,
                  letterSpacing: 1,
                  marginBottom: 3,
                }}
              >
                {heading}
              </span>
              <span style={{ display: "block", fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
                {text}
              </span>
            </div>
          ))}
          {selected.caution && (
            <div
              style={{
                background: `${T.red}12`,
                borderLeft: `3px solid ${T.red}`,
                borderRadius: 6,
                padding: "8px 10px",
                fontSize: 11,
                color: T.red,
                lineHeight: 1.5,
              }}
            >
              ⚠️ {selected.caution}
            </div>
          )}
        </>
      ) : (
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
          Tap a numbered point on the chart, or pick one from the list below, to see where it is and
          how to press it.
        </div>
      )}
    </div>
  );
}

function ReliefList({ zones, selectedKey, onSelect }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p
        style={{
          fontSize: 10,
          letterSpacing: 2,
          color: ACCENT,
          fontWeight: 700,
          marginBottom: 10,
          marginTop: 8,
        }}
      >
        PRESSURE POINTS
      </p>
      {zones.map((zone) => {
        const active = zone.key === selectedKey;
        return (
          <button
            key={zone.key}
            type="button"
            onClick={() => onSelect(active ? null : zone.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              textAlign: "left",
              background: active ? `${zone.color}14` : T.surface,
              border: `1px solid ${active ? zone.color + "55" : T.border}`,
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 8,
              cursor: "pointer",
              color: T.text,
              fontFamily: font,
            }}
          >
            <NumberBadge n={zones.indexOf(zone) + 1} color={zone.color} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{zone.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: zone.color }}>
                  {zone.code}
                </span>
              </span>
              <ConcernTags concerns={zone.concerns} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ListRow({ active, color, n, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        textAlign: "left",
        background: active ? `${color}14` : T.surface,
        border: `1px solid ${active ? color + "55" : T.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
        cursor: "pointer",
        color: T.text,
        fontFamily: font,
      }}
    >
      <NumberBadge n={n} color={color} />
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontWeight: 700, fontSize: 14 }}>{title}</span>
        <span style={{ display: "block", fontSize: 11, color: T.muted }}>{subtitle}</span>
      </span>
    </button>
  );
}
