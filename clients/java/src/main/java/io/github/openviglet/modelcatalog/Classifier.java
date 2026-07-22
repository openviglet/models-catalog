package io.github.openviglet.modelcatalog;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Derived at-a-glance classification — the <em>same</em> logic the browsable page uses,
 * so any JVM consumer gets the identical categorization without re-implementing it. Purely
 * derived from fields already published (no schema or contract change).
 *
 * <ul>
 *   <li>{@code tags}: use-case tags from {@link ModelEntry#kind()} + {@code capabilities}
 *       + {@code modalities}, plus {@code "Open weights"} when {@code openWeights} is true.</li>
 *   <li>{@code tier}: a band bucketed from {@code pricing.inputPer1M} ({@code >= 5}
 *       {@code Frontier} · {@code >= 1} {@code High} · {@code >= 0.2} {@code Mid} · else
 *       {@code Light}) — a market proxy for capability, <em>not</em> a benchmark or quality
 *       verdict; {@code null} when the model carries no indicative price.</li>
 * </ul>
 */
public final class Classifier {

    /** Tier bands, highest first — the price-bucketed capability proxy {@link #classify} derives. */
    public static final List<String> TIERS = List.of("Frontier", "High", "Mid", "Light");

    private static final Pattern CODING = Pattern.compile("cod(e|er|ing)");

    private Classifier() {
    }

    /** Derive use-case {@code tags} + a price {@code tier} for a model entry (see class docs). */
    public static Classification classify(ModelEntry m) {
        List<String> caps = m.capabilities() != null ? m.capabilities() : List.of();
        List<String> inMod = m.modalities() != null && m.modalities().input() != null
                ? m.modalities().input()
                : List.of();
        String hay = ((m.id() != null ? m.id() : "") + " " + (m.label() != null ? m.label() : ""))
                .toLowerCase(Locale.ROOT);
        List<String> tags = new ArrayList<>();
        switch (m.kind()) {
            case EMBEDDING -> tags.add("Embeddings");
            case RERANK -> tags.add("Reranking");
            case IMAGE -> tags.add("Image gen");
            case SPEECH -> tags.add("Speech");
            case TRANSCRIPTION -> tags.add("Transcription");
            case VIDEO -> tags.add("Video");
            case MODERATION -> tags.add("Moderation");
            default -> { // CHAT / UNKNOWN
                if (caps.contains("reasoning")) {
                    tags.add("Reasoning");
                }
                if (CODING.matcher(hay).find()) {
                    tags.add("Coding");
                }
                if (inMod.contains("image") || caps.contains("vision")) {
                    tags.add("Multimodal");
                }
                if (tags.isEmpty()) {
                    tags.add("Chat");
                }
            }
        }
        // Open weights (a factual, discovery-relevant attribute) is surfaced as a tag too.
        if (Boolean.TRUE.equals(m.openWeights())) {
            tags.add("Open weights");
        }
        String tier = null;
        Double inp = m.pricing() != null ? m.pricing().inputPer1M() : null;
        if (inp != null) {
            tier = inp >= 5 ? "Frontier" : inp >= 1 ? "High" : inp >= 0.2 ? "Mid" : "Light";
        }
        return new Classification(tags, tier);
    }
}
