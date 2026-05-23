package com.shopbm.Service;

import com.shopbm.Model.Entity.Faq;
import com.shopbm.Model.Enum.FaqCategory;

import java.util.List;

public interface IFaqService {
    List<Faq> list(FaqCategory category);
}
