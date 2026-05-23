package com.shopbm.Controller;

import com.shopbm.Model.Entity.Faq;
import com.shopbm.Model.Enum.FaqCategory;
import com.shopbm.Service.IFaqService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "FAQ")
@RestController
@RequestMapping("/api/v1/faqs")
@RequiredArgsConstructor
public class FaqController {

    private final IFaqService faqService;

    @GetMapping
    public List<Faq> list(@RequestParam(required = false) FaqCategory category) {
        return faqService.list(category);
    }
}
