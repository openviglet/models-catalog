package io.github.openviglet.modelcatalog;

import java.util.List;

/**
 * The derived at-a-glance classification {@link Classifier#classify(ModelEntry)} returns:
 * use-case {@code tags} (from kind + capabilities + modalities) and a price-bucketed
 * {@code tier} (a market proxy for capability, <em>not</em> a benchmark or quality verdict;
 * {@code null} when the model carries no indicative price).
 */
public record Classification(List<String> tags, String tier) {
}
